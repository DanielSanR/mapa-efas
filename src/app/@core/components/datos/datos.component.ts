import { Component, OnInit, Input, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs'; 
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

import { ActivatedRoute, Router } from '@angular/router';
 //material 
 import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
 import { MatDialog } from '@angular/material/dialog';
// servicios
import { DatosService } from '../../services/datos.service';
import { ValidadoresService } from '../../services/validadores.service';
import { InstitucionesService } from '@core/services/institucion.service';
import { PrototiposService } from '../../services/prototipos.service';
// modelos
import { Prototipo } from '@core/models/prototipo';
import { Institucion } from '@core/models/institucion';
import { DatoAmbiental } from '../../models/datoAmbiental';
import { datoPorFecha } from '@core/models/datosPorFecha';
//extras 
import * as moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { tap,shareReplay,delayWhen,map, retryWhen, startWith } from 'rxjs/operators'; 
import { ErrorService} from '../../services/error.service';
interface Icono {
  direccion: string
  nombre_icono:string
}
interface Error {
  titulo: string
  mensaje : string
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
  @Input()selectedIndex: number | null;
  loading = false;

//interfaces 
  default :  DefInstitucion 
  error$ : Error;
  Icono_Interface :Icono
  //fechas
  dateMax = moment(); // variable para almacenar fecha actual
  dateMin  = moment(); // var para definir el rango minimo del datapicker, en este caso fecha actual -1 año
  fixedDias = Array();
  // modelos
  prototiposArr: Prototipo[];
  datosPorfecha : datoPorFecha[] // datos diarios, sin rango de fecha
  ultimosDatos : datoPorFecha;
  selected: Prototipo;
  options: Institucion[] = [];
  filteredOptions: Observable<Institucion[]>;
  //otros
  mensaje :string;
  formulario: FormGroup ;
  formNotSend : boolean = true;
  estadoClima : number = 0;
  flagChartMatTab: boolean;
  error : boolean = true;
  isLoadingPrototype: boolean  = false;
  isLoading : boolean  = true;
  selectedInstitucion  : string;
  tablaStatus : boolean = false;
  array_d_wind:any[] = [ ['NORTE','icon-north-w'],['NORESTE','icon-ne-w'],
  ['ESTE','icon-east-w'],['SURESTE','icon-se-w'],['SUR','icon-south-w'],
  ['SUROESTE','icon-swe-w'],['OESTE','icon-west-w'],['NOROESTE','icon-nwe-w'] ];
  
 //variables para datos traidos del modal
  institucion_id:number;
  prototype_id:number;
  prototipo_nombre: string;

  src_d_wind: string;
  //Suscribes
  DatosbyRangeSub$ = new Subscription;
  DatosDailySub$ = new Subscription;
  InstitucionSub$ = new Subscription();
  PrototipoService$ = new Subscription();
 
  
  constructor(private formBuilder: FormBuilder, private _DATOSXFECHA: DatosService, private cdref: ChangeDetectorRef,
              private _VALIDADORES: ValidadoresService,
              private _ADAPTER: DateAdapter<any>,
              private activatedRoute: ActivatedRoute,
              private _INSTITUCIONES: InstitucionesService,
              private _PROTOTIPOS: PrototiposService,
              private router : Router, public dialog : MatDialog,
              private _ERROR: ErrorService) {
               
                  this._ADAPTER.setLocale('es');
                  const moment1 = _rollupMoment || moment;
                  const year = this.dateMax.get('year');
                  this.dateMin = moment1([year - 1 , 0, 1]);
                  this.newForm();
                  this.activatedRoute.params.subscribe(params => {
                  this.institucion_id = params['inst_id'];
                  this.prototype_id = params['protype_id'];
                    
                });
                     
              }
 
 
  ngOnInit(): void {

    //sub para manejo de errores service
    this._ERROR.enviarErrorjeObservable.subscribe(response => {
this.error$.mensaje = response.mensaje;this.error$.titulo = response.titulo;
 
//console.log(response)
    });

    this.default = {
      id : 0,
      nombre: 'Seleccione una Institucion valida',
      cue: "000000000",
      longitud:1,
      latitud:1
    };
    this.Icono_Interface = {
      direccion :'NORTE',
      nombre_icono : 'icon-north-w'
    }
    this.error$ = {
      titulo: 'Cargando datos',
      mensaje: 'Cargando...' 
    };
    this.InstitucionSub$.add(this._INSTITUCIONES.getInstitucion()/* .pipe(
      shareReplay(),
      retryWhen(errors => {
          return errors
                  .pipe(delayWhen(() => timer(5000)),
                      tap(() => { 
                       this.ConnectionTimeOut();
                    })
                  );
      } )
    ) */.subscribe(
      result => {
            this.error=false;
            this.options=result;
            this.isLoading = false;          
          },
          err => 
          this.loading = false
          ),
          ) 
        this.filteredOptions = this.formulario.controls.institutoControl.valueChanges
        .pipe(
          startWith(''),      
          map(value => typeof value === 'string' ? value : value.nombre),
          map(nombre => nombre ? this._filter(nombre) : this.options.slice())
        );
        if (this.institucion_id > 0 ){
          setTimeout(() => {
            this.error = false;
            this.getEstaciones();
          }, 500);       
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
change(){
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

getPrototipos( institucionId: { id: number; }): any{
  this.error$ = {
    titulo: 'Cargando...',
    mensaje: 'Cargando...' 
  };
  this.error = true;
  this.isLoadingPrototype = true;
  this.tablaStatus = false;
  this.selected=null;
    this.PrototipoService$.add(this._PROTOTIPOS.getInstitucion(institucionId.id)./* pipe(
      shareReplay(),
      retryWhen(errors => {
          return errors
                  .pipe(delayWhen(() => timer(5000)),
                      tap(() => {
                       this.ConnectionTimeOut();})
                  );
      } )
    ). */subscribe(
      result  => { 
        this.isLoadingPrototype = false;  
        this.prototiposArr = result
     
        if  (((!result) || this.prototiposArr.length < 1)) {
          this.error$ = {
            titulo: 'sinDatos',
            mensaje: 'No hay Prototipos para la Institución seleccionada' 
          };
          this.selected = null, this.prototiposArr = [];
         } else { 
          this.selectedInstitucion = this.formulario.controls.institutoControl.value['nombre'];
           this.error = false} 
        
    },
    err => this.loading = false
    )
    )
    
  }
  // creamos el reactive form
newForm(): void{

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
  //Funcion que refleja el error de timeot en la interfaz
ConnectionTimeOut(){
  this.error$ = {
    titulo: 'buscar',
    mensaje: 'Reintentando...' 
  };
  setTimeout(() => {
    this.error$ = {titulo: 'internet',
    mensaje: 'No se pudieron recuperar los datos, compruebe su conexión.'
    };
  }, 2000);
}
//busca los datos de la API
searchData(): void{ 
   this.loading = true;
              if(this.formNotSend) {
               this.formNotSend = false;
                this.error$ = {
                  titulo: 'buscar',
                  mensaje: 'Buscando...' 
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
                    if  (this.checkStatus === true) {
                    
                      let datoamb = DatoAmbiental;
                      this.DatosbyRangeSub$ =this._DATOSXFECHA.getByRange(this.selected.id,
                      this.formulario.controls.fechaInicio.value.format('YYYY-MM-DD'),
                      this.formulario.controls.fechaFin.value.format('YYYY-MM-DD')
                      )./* pipe(
                        map(result => result ),
                        shareReplay(),
                        retryWhen(errors => {
                          return errors
                                .pipe(delayWhen(() => timer(3000)),
                                tap(() => {
                                  this.formNotSend = false;
                                  this.ConnectionTimeOut(); 
                                        })
                                    );
                                } )
                      ). */subscribe(
                        result => {
                          this.loading= false
                          this.formNotSend = true;
                          /* this.formulario.controls.value.patchValue({
                            formEnviado : false,
                            }) */
                          if(!(result.datosPorFecha) || (!result.datosPorFecha[0]))
                          {
              
                            this.error$ = {
                              titulo: 'sinDatos',
                              mensaje: 'No se encontrarón datos en el rango seleccionado.'
                            };
                            this.error = true;
                          }
                          else {  
                            this.error=false;
                            this.datosPorfecha = result.datosPorFecha
                            
                            this.processData();    
                          }
                        
                        }, 
                        err => this.loading = false
                      );
                        
              
                    }
              
                //datos por una sola fecha
                     else
                      {        
                      this.DatosDailySub$ = this._DATOSXFECHA.getByDay
                      (this.selected.id,
                       this.formulario.controls.fechaInicio.value.format('YYYY-MM-DD')
                       )/* .pipe(
                        map(result => result),
                        shareReplay(),
                        retryWhen( errors => {
                        return errors
                               .pipe(delayWhen(() => timer(3000)),
                                tap(() => {
                                      this.formNotSend = false;
                                      this.ConnectionTimeOut(); })
                                    );
                                    } )
                      ) */.subscribe(
                        result => {
                          this.loading= false
                          this.formNotSend = true;
                        /*   this.formulario.controls.value.patchValue({
                            formEnviado : false,
                            }) */
                          if(!result.datosPorFecha[0])
                          { 
                            this.error$ = {
                              titulo: 'sinDatos',
                              mensaje: 'No se encontrarón datos para la fecha seleccionada.'
                          };
                            this.error = true;
                        }
              
                          else {
                            this.datosPorfecha = result.datosPorFecha
                            this.error=false;
                          
                            this.processData();
                         }
                         
                  
                    }, 
                      //var q muestra el error de API
                      err => this.loading = false
                                                            )  
                }
              }
              }
    
     
}
 
//setea los iconos del clima
setIcon() {
  let fecha = Number(moment.utc(new Date(this.ultimosDatos.fecha)).format('HH'));
 
  this.estadoClima =(this._VALIDADORES.clima(this.ultimosDatos.datosAmbientales['lluvia'],this.ultimosDatos.datosAmbientales['humedadAmbiente'],
  
  this.ultimosDatos.datosAmbientales['precipitaciones'],fecha));
  

  const direc = this.ultimosDatos.datosAmbientales['direccionViento']
  if (( direc <= 7)  &&  (direc > 0))
  {
    this.Icono_Interface.direccion = this.array_d_wind[direc][0]
    this.Icono_Interface.nombre_icono  = this.array_d_wind[direc][1]
    
  }
this.src_d_wind= 'assets/images/icons_modal/icons_dire_wind/icons-blue/'+ this.Icono_Interface.nombre_icono +'.png';
}
//limpia valores q vienen sin 0 y realiza validaciones
processData(){

this.ultimosDatos = this.datosPorfecha[0]
 this.setIcon();
   
  

                    this.error=false;
                
                    this.datosPorfecha.forEach(element => {
                    const useContex: any = 
                                    ({
                                      temperaturaAmbiente=0,
                                      humedadAmbiente=0,
                                      humedadSuelo=0,
                                      luz=0,
                                      lluvia=0,
                                      viento=0,
                                      precipitaciones=0,
                                      direccionViento=0
                                    }) => {
                  return {
                          temperaturaAmbiente:this.fixValues(temperaturaAmbiente),
                          humedadAmbiente:(humedadAmbiente),
                          humedadSuelo:this.fixValues(humedadSuelo),
                          luz:this.fixValues(luz),
                          lluvia:this.fixValues(lluvia),
                          viento:this.fixValues(viento),
                          precipitaciones:this.fixValues(precipitaciones),
                          direccionViento:((direccionViento)>7 ? direccionViento=0 : direccionViento=direccionViento)
                      }
    
                    }
                    let test  :DatoAmbiental[];
                    test =useContex(element.datosAmbientales);
                    element.datosAmbientales =  test;
                     
                  }); 
                  this.prototipo_nombre = this.selected.nombre; 
                 
                    this.tablaStatus = true;
                    this.calculateDayDiff(this.datosPorfecha, this.formulario.controls.fechaInicio.value,
                    this.formulario.controls.fechaFin.value)
                    this.flagChartMatTab = true
}

fixValues(valor : number){
  
  if ((valor < 0) || (valor > 999 )){
    valor = 0;
    return valor;
  }
  else return valor;

}

//sirve para sacar los dias en los que hay datos
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

getEstaciones( ): void{
   const institucion = this.options.map(x => x.id).indexOf(Number(this.institucion_id));
   this.formulario.controls.institutoControl.patchValue({
    nombre: this.options[institucion].nombre,
    id: this.options[institucion].id
});
 
this.getPrototipos(this.formulario.get('institutoControl').value);
   setTimeout(() => {
    
    if  (!this.prototiposArr) {this.selected = null, this.prototiposArr = [] }

    else {  const prototipo  = this.prototiposArr.map(x => x.id).indexOf(Number(this.prototype_id));
      this.selected = this.prototiposArr[prototipo];}
  
    
   }, 500);


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
