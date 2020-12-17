import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prototipo } from '@core/models/prototipo';
import { TablaDatosComponent } from '@core/components/estaciones/estacion/tabla-datos/tabla-datos.component';
import { DatePipe } from '@angular/common';
import { EstacionService } from '@core/services/estacion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-estacion',
  templateUrl: './estacion.component.html',
  styleUrls: ['./estacion.component.css']
})

export class EstacionComponent implements OnInit {

  institution_id: number;
  stationData: Prototipo;
  latest_environmental_data: any;
  current_date: Date = new Date();
  current_date_formatted: any;
  prototype_id: number;
  data_prototype: any[] = [];
  last_data_prototype: any;
  array_data_weather:any[];
  last_data_day:any = [];
  icon_d_wind: string = 'icon-north-w';
  
  constructor(  private _estacionService: EstacionService,
                private router: Router,
                private datePipe: DatePipe, public dialogRef: MatDialogRef<EstacionComponent>,
                @Inject( MAT_DIALOG_DATA) public data: any ) {
                  this.stationData = data.element;
                  this.institution_id = data.institution_id;
                }

  
  ngOnInit(): void {  
    this.prototype_id = this.stationData.id;
    this.current_date_formatted = this.datePipe.transform(this.current_date,"yyyy-MM-dd");
    this.getDataPrototype(this.prototype_id, this.current_date_formatted);
  }

  private getDataPrototype(prototype_id:number, current_date_formatted:any) {
    //TODO:sacar datos estaticos
    prototype_id = 1;
    current_date_formatted = '2020-01-31'; 
    this.last_data_prototype = this._estacionService.getPrototypeLastData(prototype_id, current_date_formatted).subscribe(result => {
      const array_aux_result = new Array(result);
      this.array_data_weather = [];
      array_aux_result.forEach(dato => {

        var data_weather = {}
        let obj_datosAmbientales = dato['datosAmbientales'];

        data_weather = {
          fecha: dato['fecha'],
          temperatura: obj_datosAmbientales.temperaturaAmbiente,
          humedad_ambiente: obj_datosAmbientales.humedadAmbiente,
          humedad_suelo: obj_datosAmbientales.humedadSuelo,
          radiacion: obj_datosAmbientales.luz,
          viento: obj_datosAmbientales.viento,
          direccion_viento: 'NORTE',
          lluvia: obj_datosAmbientales.lluvia,
          precipitacion: obj_datosAmbientales.precipitaciones
        }
        this.array_data_weather.push(data_weather);
      });

      if(this.array_data_weather.length > 1) {
        this.last_data_day = this.array_data_weather[this.array_data_weather.length - 1]
      } else  {
        this.last_data_day = this.array_data_weather[0];
      } 

    });
    
  }
  

  public redirectDatos() {
    this.dialogRef.close();
    this.router.navigate(['/datos',{ inst_id: this.institution_id, protype_id: this.prototype_id }]);
  }

}
