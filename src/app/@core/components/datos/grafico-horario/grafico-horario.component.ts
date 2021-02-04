import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { default as _rollupMoment } from 'moment';
import * as Highcharts from 'highcharts';

import { ChangeDetectorRef } from '@angular/core';
import { datoPorFecha } from '@core/models/datosPorFecha';


@Component({
  selector: 'app-grafico-horario',
  templateUrl: './grafico-horario.component.html'
})
export class GraficoHorarioComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts; 
  chartOptions: Highcharts.Options; 
  updateFlag: boolean; 
  
  flag: boolean;
  optionsC: any;
  arrFech : any;
  arrFechasHM= [];
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
    for ( let i = 0; i < this.datosGrafico.length; i++){
      this.arrFechasHM.push(moment(new Date(this.datosGrafico[i].fecha)).format('DD-MM-YY HH:mm'));      
    
      mDatos[i][0] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
      mDatos[i][1] = this.datosGrafico[i].datosAmbientales['humedadAmbiente'];
      mDatos[i][2] = this.datosGrafico[i].datosAmbientales['humedadSuelo'];
      mDatos[i][3] = this.datosGrafico[i].datosAmbientales['luz'];
      mDatos[i][4] = this.datosGrafico[i].datosAmbientales['lluvia'];
      mDatos[i][5] = this.datosGrafico[i].datosAmbientales['viento'];
      mDatos[i][6] = this.datosGrafico[i].datosAmbientales['precipitaciones'];
      mDatos[i][7] = this.datosGrafico[i].datosAmbientales['direcionViento'];
        
       
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
  
    
    this.optionsC = {
      chart: {
        type: 'spline',
        alignTicks: false,
        height: 369.8,
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
        type:'datetime',
        categories: this.arrFechasHM.reverse()
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
          } 
        }
      },
      series: [{
        
        name: 'Viento',
        data: arrViento.reverse(),
        tooltip: {
          pointFormat: 'Vel. Viento :{point.y:.1f}km/h'
      },
      }, {
        name: 'Temperatura',
        data: arrTemperatura.reverse(),
        tooltip: {
          pointFormat: 'Temperatura :{point.y}ºC'
      }
      }, {
        name: 'Luminosidad',
        data: arrLuz.reverse(),
        tooltip: {
          pointFormat: 'Luminosidad :{point.y:.0f}%'
      }
      }, {
        name: 'Lluvia',
        data: arrLluvia.reverse(),
        tooltip: {
          pointFormat: 'Lluvia :{point.y:.0f}%'
      }
    }, {
        name: 'Precipitación',
        data: arrPrecipitacion.reverse(),
        tooltip: {
          pointFormat: 'Precipitación :{point.y:.0f}mm'
      }
    }, {
        name: 'Humedad Ambiente',
        data: arrHumedad_ambiente.reverse(),
        tooltip: {
          pointFormat: 'Humedad A. :{point.y:.0f}%'
      }
      }, {
        name: 'Humedad Suelo',
        data: arrHumedad_suelo.reverse(),
        tooltip: {
          pointFormat: 'Humedad S. :{point.y:.0f}%'
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
