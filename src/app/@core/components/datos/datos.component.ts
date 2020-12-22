import { Component, OnInit, QueryList, AfterViewInit, ViewChild, ViewChildren, Input, ɵConsole, OnDestroy } from '@angular/core';
import Prototipos from '../../../../assets/jsons/prototipos.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {empty, Observable, Subscription} from 'rxjs';
import {map, retryWhen, startWith} from 'rxjs/operators';
import { DatosService } from '../../services/datos.service';
 
import { InstitucionesService } from '@core/services/institucion.service';
import { ChangeDetectorRef } from '@angular/core';
import { Prototipo } from '@core/models/prototipo';
import { Institucion } from '@core/models/institucion';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { ValidadoresService } from '../../services/validadores.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { GraficoComponent } from './grafico/grafico.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { PrototipoDatos } from '../../models/prototipoDatos';
import { datoPorFecha } from '@core/models/datosPorFecha';
import { HttpErrorResponse } from '@angular/common/http';
import { PrototiposService } from '../../services/prototipos.service';
import { MatDialog } from '@angular/material/dialog';
import { DatoAmbiental } from '../../models/datoAmbiental';
import { debounceTime } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { shareReplay } from 'rxjs/operators';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs'; 
 
/* Falta por hacer : 
Setear el ultimo dato traido en Ultima act. 
manejo de errores en dialog 
fixear el form de instituciones ---
definir un preload para form ---
definir preload para datos tabla/gráfico --- */

interface Error {
  titulo: string
  mensaje : string
  color: string
}

interface DefInstitucion {
  nombre: string;
  id: number;
  cue: string;
  longitud: number;
  latitud: number;
  
}

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],

})



export class DatosComponent implements OnInit,OnDestroy {
  default :  DefInstitucion = {
    id : 0,
    nombre: 'Seleccione una Institucion valida',
    cue: "000000000",
    longitud:1,
    latitud:1
  };
 error$ : Error;
@Input()selectedIndex: number | null;
  flagChartMatTab: boolean;
  error : boolean
  
  fixedDias = Array();
  dateMax = moment(); // variable para almacenar fecha actual
  dateMin  = moment(); // var para definir el rango minimo del datapicker, en este caso fecha actual -1 año
  prototiposArr: Prototipo[];
  datosPorfecha : datoPorFecha[] // datos diarios, sin rango de fecha
  ultimosDatos : datoPorFecha;
  selected: Prototipo;
  tablaStatus = false;
  options: Institucion[] = [];
  filteredOptions: Observable<Institucion[]>;
  formulario: FormGroup ;
 //variables para datos traidos del modal
  institucion_id:number;
  prototype_id:number;
  prototipo_nombre: string;

  //Suscribes
  DatosbyRangeSub$ = new Subscription;
  DatosDailySub$ = new Subscription;
  InstitucionSub$ = new Subscription();
  PrototipoService$ = new Subscription();
  //para errores de la API institucion y prototipo

  isLoadingPrototype = false;
  isLoading = false;
  
  constructor(private formBuilder: FormBuilder, private _DATOSXFECHA: DatosService, private cdref: ChangeDetectorRef,
              private _VALIDADORES: ValidadoresService,
              private _ADAPTER: DateAdapter<any>,
              private activatedRoute: ActivatedRoute,
              private _INSTITUCIONES: InstitucionesService,
              private _PROTOTIPOS: PrototiposService,
              private router : Router, public dialog : MatDialog) {
               
                      this._ADAPTER.setLocale('es');
                      const moment1 = _rollupMoment || moment;
                      const year = this.dateMax.get('year');
                      this.dateMin = moment1([year - 1 , 0, 1]);
                      this.crearFormulario();

                // this.simulargetDatosEstacion();
                
                      this.activatedRoute.params.subscribe(params => {
                        this.institucion_id = params['inst_id'];
                        this.prototype_id = params['protype_id'];
                       
                });
                     
                }
 
 
  ngOnInit(): void {
   
    this.isLoading = true;
    this.InstitucionSub$.add(this._INSTITUCIONES.getInstitucion().pipe(
      tap(() => console.log("HTTP request executed")), 
      shareReplay(),
      retryWhen(errors => {
          return errors
                  .pipe(delayWhen(() => timer(5000)),
                      tap(() => console.log('Reintentando...'))
                  );
      } )
    ).subscribe(
      result => {
            this.options=result;
            this.isLoading = false;  
          
          })) 
        this.filteredOptions = this.formulario.controls.institutoControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.nombre),
          map(nombre => nombre ? this._filter(nombre) : this.options.slice())
        );
        if (this.institucion_id > 0 ){
          setTimeout(() => {
            this.simulargetDatosEstacion();
          }, 1500);
          
          
  
  }
 
    
 
     
  }

get prototipoNoValido(): boolean{
    return this.formulario.get('prototipoControl').hasError('required');
  }

get institutoNoValido(): boolean{
    return this.formulario.get('institutoControl').hasError('required');
  }

get institutoNoValidoLista(): boolean {
    return this.formulario.get('institutoControl').hasError('NoSelect');
}

get hastaMenorDesde(): boolean {
  return this.formulario.get('fechaFin').hasError('esMenor');
}

get outRangeMax(): boolean {
  return this.formulario.get('fechaFin').hasError('outRangeMax');
}
get outRangeMin(): boolean {
  return this.formulario.get('fechaFin').hasError('outRangeMin');
}
get checkStatus(): boolean {
  return this.formulario.get('checkbox').value;
}
cambiar(){
  this.flagChartMatTab = false;
  
}
  // funcion para mostrar las instituciones en el autocomplete
displayInstitucion(institucion: Institucion): string {
    return institucion && institucion.nombre ? institucion.nombre : '';
  }
  // funcion para filtrar las instituciones
  private _filter(nombre: string): Institucion[] {
    const filterValue = nombre.toLowerCase();

    return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
  }



 
obtenerPrototipo( institucionId: { id: number; }): any{
       this.isLoadingPrototype = true;
    this.PrototipoService$.add(this._PROTOTIPOS.getInstitucion(institucionId.id).pipe(
      tap(() => console.log("HTTP request executed")), 
      shareReplay(),
      retryWhen(errors => {
          return errors
                  .pipe(delayWhen(() => timer(5000)),
                      tap(() => console.log('Reintentando...'))
                  );
      } )
    ).subscribe(
      result  => { 
        this.isLoadingPrototype = false;  
        this.prototiposArr = result
        if  (typeof(result) === 'undefined') {this.selected = null, this.prototiposArr = [];console.log("No hay prototipos para la Institucion seleccionada"); }
     
        

    })

    )
    
  }
  // funcion que vamos a usar para recibir los datos de EstacionesComponent
crearFormulario(): void{

    this.formulario = this.formBuilder.group({
      institutoControl: ['', [Validators.required, this._VALIDADORES.isInstitucion]],
      prototipoControl: ['',  Validators.required],
      checkbox: [false],
      fechaInicio: [ moment(), Validators.required],
      fechaFin: [ moment(), Validators.required],
    },
    {
      validators: [
        this._VALIDADORES.validacionFechaDesde('fechaInicio', 'fechaFin', 'checkbox', this.dateMin.format(), this.dateMax.format())
            ]
    });

  }

buscarDatos(): void{ 
  this.error$ = {
    titulo: 'Buscando datos',
    mensaje: 'Buscando...',
    color: 'primary'
  };
     this.error= true;
  
 // Falta verificar si es por rango o no
     this.selectedIndex = 0;
     this.tablaStatus = false;
     let delay = 0
     if  (this.formulario.invalid){
       return Object.values(this.formulario.controls).forEach(control => {
        this.tablaStatus = false;
        control.markAsTouched();
       });
     }
     else {
     
       //datos por rango de fechas
      if  (this.checkStatus === true) {
        
         let datoamb = DatoAmbiental;
          this.DatosbyRangeSub$=  this._DATOSXFECHA.getByRange(this.selected.id,this.formulario.controls.fechaInicio.value.format('YYYY-MM-DD'),this.formulario.controls.fechaFin.value.format('YYYY-MM-DD')
                                                ).pipe(
                                                  tap(() =>console.log("peticion ejecutada")), 
                                                  map(result => result ),
                                                  shareReplay(),
                                                  retryWhen(errors => {
                                                      return errors
                                                              .pipe(delayWhen(() => timer(5000)),
                                                                  tap(() => {
                                                                    this.error$ = {
                                                                      titulo: 'Error en la conexion a la API',
                                                                      mensaje: 'No se pudo conectar a internet, compruebe su conexión.',
                                                                      color: 'warn'
                                                                    };
                                                                    console.log("Reintentando ")})
                                                              );
                                                  } )
                                                ).subscribe(
                                                  result => {
                                                    if((typeof(result.datosPorFecha[0]) === 'undefined'))
                                                    {
                                                      this.error$ = {
                                                        titulo: 'Fechas sin datos',
                                                        mensaje: 'No se encontrarón datos en el rango seleccionado.',
                                                        color: 'warn'
                                                      };
                                                      this.error = true;
                                                   
                                                      
                                  
                                                    }
                                  
                                                    else {
                                                      this.error=false;
                                                      this.datosPorfecha = result.datosPorFecha
                                                      console.log(this.datosPorfecha)
                                                      this.procesarDatos();
                                                      
                                                    }
                                  
                                                      
                                                }, 
                                                err => console.log("Ocurrio un error conectandose a la API"),
                                                () => console.log("Petición completada.")
                                                )
      
       

    }
    //datos por una sola fecha
  else
   {     
        
         
        this.DatosDailySub$= this._DATOSXFECHA.getByDay(this.selected.id,this.formulario.controls.fechaInicio.value.format('YYYY-MM-DD')
                                                ).pipe(
                                                  tap(() => console.log("peticion ejecutada")),
                                                  map(result => result ), 
                                                  shareReplay(),
                                                  retryWhen(errors => {
                                                      return errors
                                                              .pipe(delayWhen(() => timer(5000)),
                                                                  tap(() => {
                                                                    this.error$ = {
                                                                      titulo: 'Error en la conexion a la API',
                                                                      mensaje: 'No se pudo conectar a internet, compruebe su conexión.',
                                                                      color: 'warn'
                                                                    };
                                                                   
                                                                    console.log("Reintentando ...")})
                                                              );
                                                  } )
                                                ).subscribe(
                result => {
                  if((typeof(result.datosPorFecha[0]) === 'undefined'))
                  { 
                    this.error$ = {
                      titulo: 'Fecha sin datos',
                      mensaje: 'No se encontrarón datos para la fecha seleccionada.',
                      color: 'warn'
                    };
                    this.error = true;
              
                    

                  }

                  else {
                    this.datosPorfecha = result.datosPorFecha
                   
                    this.procesarDatos();
                    
                  }

                    
              }, 
              //var q muestra el error de API
              err => console.log("Ocurrio un error conectandose a la API"),
              () => console.log("Petición  completada")) 
       

    }
}  
  
    
}

procesarDatos(){
  this.ultimosDatos = this.datosPorfecha[this.datosPorfecha.length - 1]
                 
                    this.error=false;
                
                    this.datosPorfecha.forEach(element => {
                    const useContex: any = 
                                    ({
                                    humedadAmbiente =  0,
                                    humedadSuelo =  0,
                                    lluvia =  0,
                                    luz=  0,
                                    precipitaciones=  0,
                                    temperaturaAmbiente=  0,
                                    viento=  0
                                    }) => {
                  return {
                          humedadAmbiente:humedadAmbiente,
                          humedadSuelo:humedadSuelo,
                          lluvia:lluvia,
                          luz:luz,
                          precipitaciones:precipitaciones,
                          temperaturaAmbiente:temperaturaAmbiente,
                          viento:viento
                        }
    
                    }
                    let test  :DatoAmbiental[];
                    test =useContex(element.datosAmbientales);
                    element.datosAmbientales =  test
                 
                    
                    
                  }); 
                  this.prototipo_nombre = this.selected.nombre; 
                   
                    this.tablaStatus = true;
                    this.calculateDayDiff(this.datosPorfecha, this.formulario.controls.fechaInicio.value,
                    this.formulario.controls.fechaFin.value)
                    this.flagChartMatTab = true
}
calculateDayDiff(result: any, fecha1: string, fecha2: string){
 
  const f1 = fecha1;
  const f2 = moment(fecha2);
  const dias = f2.diff(f1, 'days');
  const arrDias = [];
  const datos: any = result;
  const mySet = new Set();
  for (let i =  0; i <= dias ; i++) {
    arrDias.push((moment(new Date(f1)).add(i , 'days')).format('YYYY-MM-DD'));
     
  }
  datos.forEach( dato => {
    const datoc = moment(new Date(dato.fecha)).format('YYYY-MM-DD');
    if ( arrDias.indexOf(datoc) !==  -1){
      mySet.add(datoc);
    }
   });
   this.fixedDias = Array.from(mySet);
}

simulargetDatosEstacion( ): void{
   const institucion = this.options.map(x => x.id).indexOf(Number(this.institucion_id));
   this.formulario.controls.institutoControl.patchValue({
    nombre: this.options[institucion].nombre,
    id: this.options[institucion].id
});
 
this.obtenerPrototipo(this.formulario.get('institutoControl').value);
   setTimeout(() => {
    
     
    if  (typeof(this.prototiposArr) === 'undefined') {this.selected = null, this.prototiposArr = [] }

    else {  const prototipo  = this.prototiposArr.map(x => x.id).indexOf(Number(this.prototype_id));
      this.selected = this.prototiposArr[prototipo];}
  
    
   }, 1500);


}

ngAfterContentChecked() {
  this.cdref.detectChanges();
 }

ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.DatosbyRangeSub$.unsubscribe();
  this.DatosDailySub$.unsubscribe();
  this.InstitucionSub$.unsubscribe();
}


}
