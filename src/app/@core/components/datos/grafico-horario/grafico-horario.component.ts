import { Component, OnDestroy, OnInit, Input, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
import { ChangeDetectorRef } from '@angular/core';
import { DatosService } from '../../../services/datos.service';

@Component({
  selector: 'app-grafico-horario',
  templateUrl: './grafico-horario.component.html',
  styleUrls: ['./grafico-horario.component.css']
})
export class GraficoHorarioComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts; // required
  chartOptions: Highcharts.Options; // required
  updateFlag: boolean; // optional boolean

  flag: boolean;
  optionsC: any;
  arrFech : any;
  datos: any;
@Input() fechas: any;

  constructor(private cdref: ChangeDetectorRef,private _DATOSHORARIOS: DatosService) { 
    
      
    
  }

  ngOnInit(): void {
   
    this._DATOSHORARIOS.getDatosHorarios().subscribe( result => {
      this.datos=result; 
      this.addData();
     });

  }
addData(){ 
   this.arrFech = Object.values(this.fechas);
  const checkbox   = true;
 
  if (checkbox){
    const mDatos = new Array(25);
    for ( let i = 0; i < 25; i++){
      mDatos[i] = new Array(3);
    } 
    for ( let i = 0; i < this.datos.length; i++){
             
              mDatos[i][0] = this.datos[i].datoxFecha.datosAmbientales.viento;
              mDatos[i][1] = this.datos[i].datoxFecha.datosAmbientales.temperatura;
              mDatos[i][2] = this.datos[i].datoxFecha.datosAmbientales.radiacion;
              mDatos[i][3] = this.datos[i].datoxFecha.datosAmbientales.precipitacion;
              mDatos[i][4] = this.datos[i].datoxFecha.datosAmbientales.humedad_ambiente;
              mDatos[i][5] = this.datos[i].datoxFecha.datosAmbientales.humedad_suelo;
        
       
 }
    if (this.datos.length > 0 ){
    this.crearGrafico(mDatos, this.fechas);

    this.flag = false;
}

}

 else { this.flag = true;
 }
}

crearGrafico(datos: any, dias: any[]): void{
  // tomar la fecha del json 
    const arrViento = [];
    const arrTemperatura = [];
    const arrHumedad_ambiente = [];
    const arrHumedad_suelo = [];
    const arrRadiacion = [];
    const arrPrecipitacion = [];
    for ( let i = 0; i < 25; i++){
      arrViento.push(datos[i][0]);
      arrTemperatura.push(datos[i][1]);
      arrRadiacion.push(datos[i][2])
      arrPrecipitacion.push(datos[i][3]);
      arrHumedad_ambiente.push(datos[i][4]);
      arrHumedad_suelo.push(datos[i][5]);
      
    }  
    this.optionsC = {
      chart: {
        type: 'spline',
        height: 300,
        zoomType: 'x',
        renderTo: 'container'
      },
      title: {
        text: 'Gráfico de datos agrometeorológicos'
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Datos por fecha'
        }
      },
      xAxis: {
        accessibility: {
          rangeDescription: 'Rango de Datos :'

        },
        type: 'datetime'
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: moment.utc(this.arrFech[0]).valueOf(),
          pointInterval: 3600 * 1000 * 1,
        }
      },
      series: [{
        name: 'Viento',
        data: arrViento,
        tooltip: {
          pointFormat: 'Vel. Viento {point.y:.1f}km/h'
      },
      }, {
        name: 'Temperatura',
        data: arrTemperatura,
        tooltip: {
          pointFormat: 'Temperatura : {point.y}ºC'
      }
      }, {
        name: 'Radiacion',
        data: arrRadiacion,
        tooltip: {
          pointFormat: 'Radiación {point.y:.0f} de 10'
      }
      }, {
        name: 'Precipitación',
        data: arrPrecipitacion,
        tooltip: {
          pointFormat: 'Precipitación  {point.y:.0f}mm'
      }
    }, {
        name: 'Humedad Ambiente',
        data: arrHumedad_ambiente,
        tooltip: {
          pointFormat: 'Humedad A.{point.y:.0f}%'
      }
      }, {
        name: 'Humedad Suelo',
        data: arrHumedad_suelo,
        tooltip: {
          pointFormat: 'Humedad S. {point.y:.0f}%'
      }
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 400
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }};
    this.cdref.detectChanges();
    this.chartOptions = this.optionsC;
    this.updateFlag = true;



  }
  ngAfterContentChecked() {
    
   }
}