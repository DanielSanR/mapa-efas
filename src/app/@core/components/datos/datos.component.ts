import { Component, OnInit, ɵConsole, ViewChild } from '@angular/core';
import instituciones from '../../../../assets/jsons/instituciones_nombres.json';
import Prototipos from '../../../../assets/jsons/prototipos.json';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { DatosxFechaService } from '../../services/datos.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangeDetectorRef } from '@angular/core';
import { Prototipo } from '@core/models/prototipo';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';

// sin lat y long, se puede hacer un parametro  opcional desde la clase Institucion = , proximo update
export interface Institucion {
  descripcion: string;
  id: number;
}

/*
export interface Prototipo {
  nombre: string;
  id: number;
  lat: string;
  long: string;
} */


@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;


  hasta = new Date();
  minDate = new Date();

  prototiposArr: Prototipo[];
  selected: Prototipo;
  tablaStatus = false;

  options: Institucion[] = instituciones;
  filteredOptions: Observable<Institucion[]>;

  rango: boolean; // para saber si esta o no habiltiado el rango de datos
  formulario: FormGroup ;
  datos: any; // array de datos ambientales
  dataSource: MatTableDataSource<Prototipo[]>;
  displayedColumns: string[] = ['position',

  'desc',
  'datoxFecha',
  'viento',
  'temperatura',
  'luz',
  'precipitacion'];

  constructor(private formBuilder: FormBuilder, private _DATOSXFECHA: DatosxFechaService, private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {



    this.formulario = this.formBuilder.group({
      institutoControl: ['', Validators.required],
      prototipoControl: ['',  Validators.required],
      fechaInicio: [ '', Validators.required],
      fechaFin: [ new Date()], // sin validacion, fixeamos con dos funciones por el momento( inicio y fin)
    });


    this.filteredOptions = this.formulario.controls.institutoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.descripcion),
        map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
      );

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

    this.prototiposArr =  Prototipos;

  }

  // tslint:disable-next-line: typedef
  buscarDatos(){
    // controlamos que sea una opcion del mat autocomplete
    if (typeof(this.formulario.controls.institutoControl.value.id) === 'undefined' )
        {
// en caso de que no sea una opcion de la lista de Institucion[] enviamos un error al formulario.
          this.formulario.controls.institutoControl.setErrors({
            NoSelect: true
          });
         // console.log('no es un objeto de prototipo' );
          this.tablaStatus = false;

}
    else {
      // es un objeto de prototipo, enviamos la peticion al service
          console.log(' es un objeto');
          this._DATOSXFECHA.getProtoipoByID(this.selected.id).subscribe(
            result => {
              this.datos = result;
              this.dataSource = new MatTableDataSource<any>(result);
              console.log(this.dataSource.data);
              this.dataSource.paginator = this.paginator;
              // this.datos.paginator = this.paginator;
              // console.log(this.datos);
            },
            error => {
             console.log(error as any);
            }
          );
          this.tablaStatus = true;

    }


  }
  // funcion para comparar las fechas, la llamaremos en buscarDatos();
  /* addEvent(type: string, event: MatDatepickerInputEvent<Date>) {


    let datevent = event.value;

    if (this.datos.length > 0){
      let dat = new Date(this.datos[0].datoxFecha.fecha);
      if (dat.toLocaleDateString() === datevent.toLocaleDateString()){
        console.log('son fechas iguales');
      }

    else {
    console.log('array vacio');
      }


    }
  } */

   // tslint:disable-next-line: typedef
 eventCheckBox( value ) {
  this.rango = value;
  if (this.rango === false){
    // this.formulario.controls['fechaFin'].setErrors(null);
  }
 }



 ngAfterContentChecked() {
    this.cdref.detectChanges();

 }
// tslint:disable-next-line: typedef
 inicio(type: string, event: MatDatepickerInputEvent<Date>) {
   this.hasta = event.value;

}
// tslint:disable-next-line: typedef
fin(type: string, event: MatDatepickerInputEvent<Date>) {

  this.hasta = this.minDate;

  }
}