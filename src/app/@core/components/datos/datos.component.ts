import { Component, OnInit } from '@angular/core';
import instituciones from '../../../../assets/jsons/instituciones_nombres.json';
import Prototipos from '../../../../assets/jsons/prototipos.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DatosService } from '../../services/datos.service';
import { ChangeDetectorRef } from '@angular/core';
import { Prototipo } from '@core/models/prototipo';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
 
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { ValidadoresService } from '../../services/validadores.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

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

  breakpoint: number;
  dateMax = moment(); // variable para almacenar fecha actual
  dateMin  = moment(); // var para definir el rango minimo del datapicker, en este caso fecha actual -1 año
  hasta = new Date();
  prototiposArr: Prototipo[];
  selected: Prototipo;
  tablaStatus = false;
  options: Institucion[] = instituciones;
  filteredOptions: Observable<Institucion[]>;
  formulario: FormGroup ;
  datos: any; // array de datos ambientales

  constructor(private formBuilder: FormBuilder, private _DATOSXFECHA: DatosService, private cdref: ChangeDetectorRef,
              private _VALIDADORES: ValidadoresService,
              private _ADAPTER: DateAdapter<any>) {

                      this._ADAPTER.setLocale('es');
                      const moment1 = _rollupMoment || moment;
                      const year = this.dateMax.get('year');
                      this.dateMin = moment1([year - 1 , 0, 1]);
                      this.crearFormulario();
                      
                // this.simulargetDatosEstacion();
                }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 480) ? 1 : 6;

    this.filteredOptions = this.formulario.controls.institutoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.descripcion),
        map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
      );
      // Highcharts.chart('container', this.optionsC);
  }

get prototipoNoValido(): boolean{
    return this.formulario.get('prototipoControl').hasError('required');
  }

get institutoNoValido(): boolean{
    return this.formulario.get('institutoControl').hasError('required');
  }

get institutoNoValidoLista(): boolean {
    return this.formulario.get('institutoControl').hasError('NoSelect')
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

obtenerPrototipo( institucionId): any{
    // aca iria el service que trae los prototipos de dicha institucion
    console.log(institucionId);
    if ( institucionId.id === 2){this.prototiposArr =  Prototipos;}
    // vaciamos el array, en caso de q no sea de San Pedro
    else{ this.selected = null,this.prototiposArr = []}
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

    console.log(this.formulario);
  }
  // tslint:disable-next-line: typedef
buscarDatos(){
     if  (this.formulario.invalid){
       return Object.values(this.formulario.controls).forEach(control =>{
        this.tablaStatus = false;
        control.markAsTouched();
       });
     }
     else {
      this._DATOSXFECHA.getProtoipoByID(this.selected.id).subscribe(
        result => {
          this.datos = result;
          
     },
     error => {
      console.log(error as any);
     }
   );
      this.tablaStatus = true;
      
  }
}
// institucionId: number, prototipoId: number
simulargetDatosEstacion( ): void{
  // llamamos al service institucion   this.obtenerPrototipo(institucionId);

  // seteamos la institucion traida  de Estacion
  this.formulario.controls.institutoControl.patchValue({
    descripcion: 'San Pedro',
    id: 2
});
  this.obtenerPrototipo(this.formulario.get('institutoControl').value);
  console.log(this.prototiposArr)
  // seteamos el prototipo enviado, y agregamos al arr los prototipos de esa institucion
  this.selected = this.prototiposArr[0];
}


ngAfterContentChecked() {
    this.cdref.detectChanges();

 }
 

}