import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Estacion } from '@core/models/estacion';
import { TablaDatosComponent } from '@core/components/estaciones/estacion/tabla-datos/tabla-datos.component';


@Component({
  selector: 'app-estacion',
  templateUrl: './estacion.component.html',
  styleUrls: ['./estacion.component.css']
})


export class EstacionComponent implements OnInit {

  stationData: Estacion;


  constructor(  public dialogRef: MatDialogRef<EstacionComponent>,
                @Inject( MAT_DIALOG_DATA) public data: any ) {
                  this.stationData = data.element;
                }

  
  ngOnInit(): void {
    //Funcion para llamar a un servicio para realizar la peticion del ultimo dato ambiental de la estacion
    //Funcion para llamar a un servicio para realizar la peticion de todos los datos ambientales del dia actual
      //Los datos devueltos colocarlos en un array y pasarlo al tabla-datos component.
  }


}

