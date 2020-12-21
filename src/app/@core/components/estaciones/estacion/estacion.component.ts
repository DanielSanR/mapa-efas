import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prototipo } from '@core/models/prototipo';
import { TablaDatosComponent } from '@core/components/estaciones/estacion/tabla-datos/tabla-datos.component';
import { DatePipe } from '@angular/common';
import { EstacionService } from '@core/services/estacion.service';
import { Router } from '@angular/router';
import { PrototipoDatos } from '@core/models/prototipoDatos';


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

  data_prototype: any;
  last_data_prototype: any;
  array_data_weather:any[]= [];
  last_data_day:any = [];
  array_d_wind:any[] = [ ['NORTE','icon-north-w'],['NORESTE','icon-ne-w'],['ESTE','icon-east-w'],['SURESTE','icon-se-w'],['SUR','icon-south-w'],['SUROESTE','icon-swe-w'],['OESTE','icon-west-w'],['NOROESTE','icon-nwe-w'] ];
  icon_d_wind:string = 'icon-north-w';
  src_d_wind:string;

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

  public getDataPrototype(prototype_id:number, current_date_formatted:any) {
    
    this.last_data_prototype = this._estacionService.getPrototypeLastData(prototype_id, current_date_formatted).subscribe(res => {

      this.data_prototype = res;
      
      if(this.data_prototype.datosPorFecha.length > 0) {
        this.data_prototype.datosPorFecha.forEach( dato_por_fecha => {
          let fecha = dato_por_fecha.fecha;
          let datosambientales = dato_por_fecha.datosAmbientales;
          const useContext = ({temperaturaAmbiente= 0, 
                              humedadAmbiente= 0,
                              humedadSuelo= 0,
                              luz= 0,
                              viento= 0,
                              direccionViento= 0,
                              lluvia= 0, 
                              precipitaciones= 0 }) => {

                return {
                    temperaturaAmbiente: temperaturaAmbiente,
                    humedadAmbiente: humedadAmbiente, 
                    humedadSuelo: humedadSuelo,
                    luz: luz,           
                    viento: viento,
                    direccionViento: direccionViento,
                    lluvia: lluvia, 
                    precipitaciones: precipitaciones,
                }
          }

          let data_weather = {};
          data_weather = useContext(datosambientales);
          data_weather['fecha'] = fecha;
          data_weather['stringDireccionViento'] = this.array_d_wind[`${data_weather['direccionViento']}`][0];
          this.array_data_weather.push(data_weather);
        });

      } else {
        let data_weather = {temperaturaAmbiente: 0,humedadAmbiente: 0,humedadSuelo: 0,luz: 0,viento: 0,direccionViento: 0,lluvia: 0, precipitaciones: 0,};
        data_weather['fecha'] = current_date_formatted;
        data_weather['stringDireccionViento'] = this.array_d_wind[`${data_weather['direccionViento']}`][0];
        this.array_data_weather.push(data_weather);
      }

      this.array_data_weather.length > 1 
        ? this.last_data_day = this.array_data_weather[this.array_data_weather.length - 1]
        : this.last_data_day = this.array_data_weather[0];
      
      
      this.icon_d_wind = this.array_d_wind[`${this.last_data_day['direccionViento']}`][1];
      this.src_d_wind = 'assets/images/icons_modal/icons_dire_wind/icons-w/'+ this.icon_d_wind +'.png';
        
    });//endsubscribe
  }//endFunction
  

  public redirectDatos() {
    this.dialogRef.close();
    this.router.navigate(['/datos',{ inst_id: this.institution_id, protype_id: this.prototype_id }]);
  }


}


