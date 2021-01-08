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
  @Input() datos: datoPorFecha[];
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
  this.datosGrafico = this.datos 
  
  if (checkbox){
    const mDatos = new Array(this.datosGrafico.length);
    for ( let i = 0; i < this.datosGrafico.length; i++){
      mDatos[i] = new Array(9);
    } 
    console.log(this.datosGrafico)
    for ( let i = 0; i < this.datosGrafico.length; i++){
      console.log(this.datosGrafico[i].fecha)
      arrFechas.push(this.datosGrafico[i].fecha);      
    
      mDatos[i][0] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
      mDatos[i][1] = this.limpiarValores(this.datosGrafico[i].datosAmbientales['humedadAmbiente']);
      mDatos[i][2] = this.limpiarValores(this.datosGrafico[i].datosAmbientales['humedadSuelo']);
      mDatos[i][3] = this.limpiarValores(this.datosGrafico[i].datosAmbientales['luz']);
      mDatos[i][4] = this.limpiarValores(this.datosGrafico[i].datosAmbientales['lluvia']);
      mDatos[i][5] = this.limpiarValores(this.datosGrafico[i].datosAmbientales['viento']);
      mDatos[i][6] = this.limpiarValores(this.datosGrafico[i].datosAmbientales['precipitaciones']);
      mDatos[i][7] = this.limpiarValores(this.datosGrafico[i].datosAmbientales['direcionViento']);
        
       
 }
 console.log(this.datosGrafico)
    if (this.datosGrafico.length > 0 ){
    this.crearGrafico(mDatos,arrFechas);

    this.flag = false;
}

}

 else { this.flag = true;
 }
}
limpiarValores(valor : number){
  
    if ((valor < 0) || (valor > 9999 )){
      valor = 0;
      return valor;
    }
    else return valor;
  
}
crearGrafico(datos: any, dias: any[]): void{
  // tomar la fecha del json 
    let arrTemperatura = [];
    let arrHumedad_ambiente = [];
    let arrHumedad_suelo = [];
    let arrLuz = [];
    let arrLluvia = [];
    let arrViento = [];
    let arrPrecipitacion = [];
    let arrDirecionViento = [];
   
    for ( let i = 0; i < this.datosGrafico.length; i++){
      arrTemperatura.push(datos[i][0]);
      arrHumedad_ambiente.push(datos[i][1]);
      arrHumedad_suelo.push(datos[i][2]);
      arrLuz.push(datos[i][3])
      arrLluvia.push(datos[i][4]);
      arrViento.push(datos[i][5]);
      arrPrecipitacion.push(datos[i][6]);
      arrDirecionViento.push(datos[i][7]);
      
      
      
      
    }
  
    console.log(arrViento);
    console.log(arrTemperatura);
    console.log(arrLuz);
    console.log(arrPrecipitacion);
    console.log(arrHumedad_ambiente);
    console.log(arrHumedad_suelo);
  
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
        data: arrLuz,
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
