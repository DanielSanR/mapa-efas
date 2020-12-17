import { Component, OnDestroy, OnInit, Input, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
import { ChangeDetectorRef } from '@angular/core';
import { datoPorFecha } from '@core/models/datosPorFecha';
import { PrototipoDatos } from '@core/models/prototipoDatos';

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
  datosGrafico : datoPorFecha[]
  @Input() datos: PrototipoDatos;
  @Input() fechas: any;

  constructor(private cdref: ChangeDetectorRef) { 
    
      
    
  }

  ngOnInit(): void {
    this.addData();
    

  }
addData(){ 
   this.arrFech = Object.values(this.fechas);
  const checkbox   = true;
  let arrFechas = []
  this.datosGrafico = this.datos.datosPorFecha
  if (checkbox){
    const mDatos = new Array(25);
    for ( let i = 0; i < 25; i++){
      mDatos[i] = new Array(3);
    } 
    for ( let i = 0; i < this.datosGrafico.length; i++){
      arrFechas.push(this.datosGrafico[i].fecha);      
      mDatos[i][0] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
      mDatos[i][1] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
      mDatos[i][2] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
      mDatos[i][3] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
      mDatos[i][4] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
      mDatos[i][5] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
        
       
 }
    if (this.datosGrafico.length > 0 ){
    this.crearGrafico(mDatos,arrFechas);

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
        alignTicks: false,
        height: 300,
        zoomType: 'x',
        animation: true,
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
          pointStart: moment.utc(dias[0]).valueOf(),
          pointInterval:  ( 60 * 1/12 ) * 1000 * 1,
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
