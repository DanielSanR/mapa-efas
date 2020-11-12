import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prototipo } from '@core/models/prototipo';
import { TablaDatosComponent } from '@core/components/estaciones/estacion/tabla-datos/tabla-datos.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-estacion',
  templateUrl: './estacion.component.html',
  styleUrls: ['./estacion.component.css']
})


export class EstacionComponent implements OnInit {

  stationData: Prototipo;
  latest_environmental_data: any;
  current_date: Date = new Date();
  current_date_formatted: any;

  
  constructor(private datePipe: DatePipe,  public dialogRef: MatDialogRef<EstacionComponent>,
                @Inject( MAT_DIALOG_DATA) public data: any ) {
                  this.stationData = data.element;
                }

  
  ngOnInit(): void {
    console.log('this.current_date',this.current_date);
    this.current_date_formatted = this.datePipe.transform(this.current_date,"yyyy-MM-dd HH:mm");
    console.log('current_date_formatted', this.current_date_formatted);
    
    //Funcion para llamar a un servicio para realizar la peticion del ultimo dato ambiental de la estacion
    //Funcion para llamar a un servicio para realizar la peticion de todos los datos ambientales del dia actual
      //Los datos devueltos colocarlos en un array y pasarlo al tabla-datos component.
  }


}

