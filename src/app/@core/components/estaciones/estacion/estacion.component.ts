import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prototipo } from '@core/models/prototipo';
import { DatePipe } from '@angular/common';
import { EstacionService } from '@core/services/estacion.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ValidadoresService } from '@core/services/validadores.service';
import moment from 'moment';



@Component({
  selector: 'app-estacion',
  templateUrl: './estacion.component.html',
  styleUrls: ['./estacion.component.css']
})

export class EstacionComponent implements OnInit, OnDestroy {

  institution_id: number;
  stationData: Prototipo;
  current_date: Date = new Date();
  current_date_formatted: any;
  prototype_id: number;
  data_prototype: any;
  last_data_prototype_subscription: Subscription;
  array_data_weather:any[]= [];
  last_data_day:any= {};
  array_d_wind:any[] = [ ['NORTE','icon-north-w'],['NORESTE','icon-ne-w'],['ESTE','icon-east-w'],['SURESTE','icon-se-w'],['SUR','icon-south-w'],['SUROESTE','icon-swe-w'],['OESTE','icon-west-w'],['NOROESTE','icon-nwe-w'] ];
  icon_d_wind:string = 'icon-north-w';
  src_d_wind:string;
  isLoading:boolean = true;
  httpErr:boolean = false;
  respData:boolean = false;
  stateWeather:number = 0;


  constructor(  private _estacionService: EstacionService,
                private router: Router,
                private datePipe: DatePipe,
                private _VALIDADORES: ValidadoresService,
                public dialogRef: MatDialogRef<EstacionComponent>,
                @Inject( MAT_DIALOG_DATA) public data: any ) {
                  this.stationData = data.element;
                  this.institution_id = data.institution_id;
                }

  
  ngOnInit() {  
    this.prototype_id = this.stationData.id;
    this.current_date_formatted = this.datePipe.transform(this.current_date,"yyyy-MM-dd");
    this.getDataPrototype(this.prototype_id, this.current_date_formatted);
  }

  

  getDataPrototype(prototype_id:number, current_date_formatted:any) {

    this.last_data_prototype_subscription = this._estacionService.getPrototypeLastData(prototype_id, current_date_formatted)
    .subscribe(res => {
      this.data_prototype = res; 
      if(this.data_prototype.datosPorFecha.length > 0) {
        this.isLoading = false
        this.respData = true;
        this.data_prototype.datosPorFecha.forEach( dato_por_fecha => {
          let fecha = dato_por_fecha.fecha;
          
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
          data_weather = useContext(dato_por_fecha.datosAmbientales);
          data_weather['fecha'] = fecha;
          (data_weather['direccionViento'] <= 7 && data_weather['direccionViento'] >= 0) 
            ? data_weather['stringDireccionViento'] = this.array_d_wind[`${data_weather['direccionViento']}`][0]
            : data_weather['stringDireccionViento'] = this.array_d_wind[0][0];

          
          data_weather = this.verifyNegativeValues(data_weather);
          this.array_data_weather.push(data_weather);

        });

        this.last_data_day = this.array_data_weather[0];
        
        (this.last_data_day['direccionViento'] <= 7 && this.last_data_day['direccionViento'] >= 0) 
          ?  this.icon_d_wind = this.array_d_wind[`${this.last_data_day['direccionViento']}`][1]
          :  this.icon_d_wind = this.array_d_wind[0][1]; 
        
        this.src_d_wind = 'assets/images/icons_modal/icons_dire_wind/icons-blue/'+ this.icon_d_wind +'.png';

        
        let hour = Number(moment.utc(new Date(this.last_data_day['fecha']).getHours()));
        this.stateWeather = this._VALIDADORES.clima( this.last_data_day['lluvia'],
                                                     this.last_data_day['humedadAmbiente'],
                                                     this.last_data_day['precipitaciones'], 
                                                     hour );
        
                                                     
      } else {
        let data_weather = {temperaturaAmbiente: 0,humedadAmbiente: 0,humedadSuelo: 0,luz: 0,viento: 0,direccionViento: 0,lluvia: 0, precipitaciones: 0,};
        data_weather['fecha'] = 0;
        this.last_data_day = data_weather;
        this.array_data_weather = [];
        this.isLoading = false;
      }
      
      
    },
    error => {
      console.log(<any>error);
      this.httpErr = true;
    });//endsubscribe
  }//endFunction
  

  public redirectDatos() {
    this.dialogRef.close();
    this.router.navigate(['/datos',{ inst_id: this.institution_id, protype_id: this.prototype_id }]);
  }

  verifyNegativeValues(data_weather:any):any {
    if( Math.sign( data_weather['humedadAmbiente']) === -1 ) data_weather['humedadAmbiente'] = 0;
    if( Math.sign( data_weather['humedadSuelo']) === -1 ) data_weather['humedadSuelo'] = 0;
    if( Math.sign( data_weather['luz']) === -1 ) data_weather['luz'] = 0;
    if( Math.sign( data_weather['viento']) === -1 ) data_weather['viento'] = 0;
    if( Math.sign( data_weather['lluvia']) === -1 ) data_weather['lluvia'] = 0;
    if( Math.sign( data_weather['precipitaciones']) === -1 ) data_weather['precipitaciones'] = 0;

    return data_weather;
  }


  ngOnDestroy(): void {
    this.last_data_prototype_subscription.unsubscribe();
  }
  

}


