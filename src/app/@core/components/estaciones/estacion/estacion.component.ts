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

  institution_id:number;
  stationData: Prototipo;
  latest_environmental_data: any;
  current_date: Date = new Date();
  current_date_formatted: any;
  prototype_id: number;
  last_data_prototype: any;
  datas_prototype: any[] = [];
  array_data:any[];
  last_data_day:any = [];
  
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
    this.last_data_prototype = this._estacionService.getPrototypeLastData(prototype_id, current_date_formatted).subscribe(result => {
      this.datas_prototype = result;
      this.array_data = [];
      this.datas_prototype.forEach( dato => {
        var data_weather = {}
        data_weather = {
              fecha: this.datePipe.transform(dato.datoxFecha.fecha,"yyyy-MM-dd HH:mm"),
              temperatura: dato.datoxFecha.datosAmbientales.temperatura,
              humedad: 50,
              viento: dato.datoxFecha.datosAmbientales.viento,
              precipitacion: dato.datoxFecha.datosAmbientales.precipitacion
        }

        this.array_data.push(data_weather);
      });

      this.last_data_day = this.array_data[this.array_data.length - 1];
    });
    
  }
  
  public redirectDatos() {
    this.dialogRef.close();
    this.router.navigate(['/datos',{ inst_id: this.institution_id, protype_id: this.prototype_id }]);
  }

}
