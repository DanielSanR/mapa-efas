import { Component, OnInit, QueryList, AfterViewInit, ViewChild, ViewChildren, Input, ɵConsole } from '@angular/core';
import instituciones from '../../../../assets/jsons/instituciones_nombres.json';
import Prototipos from '../../../../assets/jsons/prototipos.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {empty, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DatosService } from '../../services/datos.service';
import { ChangeDetectorRef } from '@angular/core';
import { Prototipo } from '@core/models/prototipo';

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
import { ActivatedRoute } from '@angular/router';
import { PrototipoDatos } from '../../models/prototipoDatos';
import { datoPorFecha } from '@core/models/datosPorFecha';
 

 

export interface Institucion {
  descripcion: string;
  id: number;
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



export class DatosComponent implements OnInit {
 
@Input()selectedIndex: number | null;
 
 
  fixedDias = Array();
  single : boolean;
  breakpoint: number;
  dateMax = moment(); // variable para almacenar fecha actual
  dateMin  = moment(); // var para definir el rango minimo del datapicker, en este caso fecha actual -1 año
  hasta = new Date();
  prototiposArr: Prototipo[];
  datosPrototipo : PrototipoDatos; // datos con rangos de fecha
  datosPorfecha : datoPorFecha[] // datos diarios, sin rango de fecha
  ultimosDatos : datoPorFecha;
  datosAmib
  selected: Prototipo;
  tablaStatus = false;
  options: Institucion[] = instituciones;
  filteredOptions: Observable<Institucion[]>;
  formulario: FormGroup ;
  datos: any; // array de datos ambientales
 
  institucion_id:number;
  prototype_id:number;
  prototipo_nombre: string;
  constructor(private formBuilder: FormBuilder, private _DATOSXFECHA: DatosService, private cdref: ChangeDetectorRef,
              private _VALIDADORES: ValidadoresService,
              private _ADAPTER: DateAdapter<any>,
              private activatedRoute: ActivatedRoute) {

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

   

    
    this.breakpoint = (window.innerWidth <= 480) ? 1 : 6;

    this.filteredOptions = this.formulario.controls.institutoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.descripcion),
        map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
      );
      if (this.institucion_id > 0 ){
        this.simulargetDatosEstacion();
        

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
  // funcion para mostrar las instituciones en el autocomplete
displayInstitucion(institucion: Institucion): string {
    return institucion && institucion.descripcion ? institucion.descripcion : '';
  }
  // funcion para filtrar las instituciones
  private _filter(descripcion: string): Institucion[] {
    const filterValue = descripcion.toLowerCase();

    return this.options.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

obtenerPrototipo( institucionId: { id: number; }): any{
    // aca iria el service que trae los prototipos de dicha institucion

    if ( institucionId.id !== 0){this.prototiposArr =  Prototipos; }
    // vaciamos el array, en caso de q no sea de San Pedro
    else{ this.selected = null, this.prototiposArr = [];
    }
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
        this.single = false;
        delay= 12000 
        console.log(this.formulario.controls.fechaInicio.value.format('YYYY-MM-DD'))
        this._DATOSXFECHA.getByRange(this.selected.id,this.formulario.controls.fechaInicio.value.format('YYYY-MM-DD'),this.formulario.controls.fechaFin.value.format('YYYY-MM-DD')
                                                ).subscribe(
                result => {
                
                this.datosPrototipo=result;
                  this.prototipo_nombre = this.selected.nombre; 
              }),
             error => {
              console.log(error as any);
             
         }
      
       

    }
    //datos por una sola fecha
  else
   {    this.single = false;
        delay= 12000
         
        this._DATOSXFECHA.getByDay(this.selected.id,this.formulario.controls.fechaInicio.value.format('YYYY-MM-DD')
                                                ).subscribe(
                result => {
                
                this.datosPrototipo=result;
                  this.prototipo_nombre = this.selected.nombre; 
              }),
             error => {
              console.log(error as any);
             
         }
      
       

    }
}
setTimeout(() => {
  this.ultimosDatos = this.datosPrototipo.datosPorFecha[this.datosPrototipo.datosPorFecha.length - 1]
  
  this.tablaStatus = true;
  this.calculateDayDiff(this.datosPrototipo.datosPorFecha, this.formulario.controls.fechaInicio.value,
    this.formulario.controls.fechaFin.value)
}, delay);
    
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

/* cambiarFecha (result: any, fecha1: string) {
 let mySet =new Set()
 const datos2: any = [];
  let f1 = moment(fecha1).format('YYYY-MM-DD');
  let f2 = moment(f1).toDate(); 
  let datos: any = result;
   mySet.add(moment(f2).format('YYYY-MM-DD 00:00'));
  let h= 0
  let hora_actual = moment(this.formulario.controls.fechaInicio.value).format('HH')
   
  for ( let i =0 ; i <= Number(hora_actual); i++){
     
      let hora = moment(datos[i].datoxFecha.fecha).format('HH');
      f2.setHours(Number(hora));
     
    
       
      
      datos[i].datoxFecha.fecha =moment(new Date(f2)).format('YYYY-MM-DD '+h+':mm');
      h=h+1
      datos2.push(datos[i]);

  }
  this.fixedDias = Array.from(mySet);
      return datos2
} */
// institucionId: number, prototipoId: number
simulargetDatosEstacion( ): void{
 
   const institucion = this.options.map(x => x.id).indexOf(Number(this.institucion_id));
 
   this.formulario.controls.institutoControl.patchValue({
    descripcion: this.options[institucion].descripcion,
    id: this.options[institucion].id
});
   this.obtenerPrototipo(this.formulario.get('institutoControl').value);
   const prototipo  = this.prototiposArr.map(x => x.id).indexOf(Number(this.prototype_id));
   this.selected = this.prototiposArr[prototipo];

}

ngAfterContentChecked() {
  this.cdref.detectChanges();
 }




}
