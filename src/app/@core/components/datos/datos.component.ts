import { Component, OnInit, QueryList, AfterViewInit, ViewChild, ViewChildren, Input } from '@angular/core';
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

export interface ITile {
  componentName: string;
}

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
tiles: Array<ITile>;
 
  fixedDias = Array();

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
  institution_id:number;
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
                        this.institution_id = params['inst_id'];
                        this.prototype_id = params['protype_id'];
                })
                }
setComponents() {
  this.tiles = new Array<ITile>();
  let components = [];
  components.push('grafico');
  components.push('tabla');
  console.log (components);
  components.forEach(component => {
  if (component === 'grafico') {
          this.setTile(component);
                    }
  if (component === 'tabla') {
          this.setTile(component);
                    }

                  });
                }

 setTile( componentName) {
        const tile = {
        componentName
                  };

        this.tiles.push(tile);
        console.log(JSON.stringify(this.tiles));
  }
  ngOnInit(): void {



    this.breakpoint = (window.innerWidth <= 480) ? 1 : 6;

    this.filteredOptions = this.formulario.controls.institutoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.descripcion),
        map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
      );
    this.setComponents();
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
     if  (this.formulario.invalid){
       return Object.values(this.formulario.controls).forEach(control => {
        this.tablaStatus = false;
        control.markAsTouched();
       });
     }
     else {
      this._DATOSXFECHA.getProtoipoByID(this.selected.id
                                        ).subscribe(
        result => {
          this.datos = this.limpiar(result, this.formulario.controls.fechaInicio.value,
            this.formulario.controls.fechaFin.value);
          this.prototipo_nombre = this.selected.nombre;


     },
     error => {
      console.log(error as any);
     }
   );
      this.tablaStatus = true;

  }
}

// funcion que limpia el json, deja solamente los dias que son consultados por el form

limpiar(result: any, fecha1: string, fecha2: string){
  const f1 = fecha1;
  const f2 = moment(fecha2);
  const dias = f2.diff(f1, 'days');
  const arrDias = [];
  const datos: any = result;
  const datos2: any = [];



  const mySet = new Set();
  for (let i =  0; i <= dias ; i++) {
    arrDias.push((moment(new Date(f1)).add(i , 'days')).format('YYYY-MM-DD'));
 }
  datos.forEach( (dato: { datoxFecha: { fecha: string | number | Date; }; }) => {
  const datoc = moment(new Date(dato.datoxFecha.fecha)).format('YYYY-MM-DD');
  if ( arrDias.indexOf(datoc) !==  -1){
    mySet.add(datoc);
  }
 });
  this.fixedDias = Array.from(mySet);

  // tslint:disable-next-line: prefer-for-of
  for ( let i = 0; i < this.fixedDias.length; i++){

    // tslint:disable-next-line: prefer-for-of
    for ( let j = 0; j < datos.length; j++){
        const datoc = moment(new Date(datos[j].datoxFecha.fecha)).format('YYYY-MM-DD');
        if ( this.fixedDias[i] === datoc){
        datos2.push(datos[j]);
        }
    }
}
  return datos2;


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

  // seteamos el prototipo enviado, y agregamos al arr los prototipos de esa institucion
  this.selected = this.prototiposArr[0];
}



ngAfterContentChecked() {
  this.cdref.detectChanges();
 }




}
