import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { default as _rollupMoment } from 'moment';
import * as Highcharts from 'highcharts';
 
import { ChangeDetectorRef } from '@angular/core';
 
import { datoPorFecha } from '@core/models/datosPorFecha';


@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html'
})
export class GraficoComponent  {

  Highcharts: typeof Highcharts = Highcharts; // required
  chartOptions: Highcharts.Options; // required
  updateFlag: boolean; // optional boolean

  flag: boolean;
  optionsC: any;
  arrFech : any;
  datosGrafico : datoPorFecha[]
@Input() datos: datoPorFecha[];
@Input() fechas: any;
 
  constructor(private cdref: ChangeDetectorRef) { }



  ngOnInit(): void {
    
    this.addData();
 
}


 addData(){
  
   this.arrFech = Object.values(this.fechas);
  const checkbox   = true;
  this.datosGrafico = this.datos 
 
    
  if (checkbox){
    const mDatos = new Array(this.arrFech.length);
    for ( let i = 0; i < this.arrFech.length; i++){
      mDatos[i] = new Array(3);
    }
    
    for ( let i = 0; i < this.arrFech.length; i++){

       
        for ( let j = 0; j < this.datosGrafico.length; j++){
            const datoc = moment(new Date(this.datosGrafico[j].fecha)).format('YYYY-MM-DD');
            if (this.arrFech[i] === datoc){
              mDatos[i][0] = this.datosGrafico[i].datosAmbientales['viento'];
              mDatos[i][1] = this.datosGrafico[i].datosAmbientales['temperaturaAmbiente'];
              mDatos[i][2] = this.datosGrafico[i].datosAmbientales['luz'];
              mDatos[i][3] = this.datosGrafico[i].datosAmbientales['precipitaciones'];
              mDatos[i][4] = this.datosGrafico[i].datosAmbientales['humedadAmbiente'];
              mDatos[i][5] = this.datosGrafico[i].datosAmbientales['humedadSuelo'];
              mDatos[i][6] = this.datosGrafico[i].datosAmbientales['lluvia'];
            }
        }
 }
    if (this.arrFech.length > 0 ){
     
    this.crearGrafico(mDatos, this.fechas);

    this.flag = false;
}

}

 else { this.flag = true;
 }
}

crearGrafico(datos: any, dias: any[]): void{
 
    const arrLluvia = [];
    const arrViento = [];
    const arrTemperatura = [];
    const arrHumedad_ambiente = [];
    const arrHumedad_suelo = [];
    const arrRadiacion = [];
    const arrPrecipitacion = [];
     
    for ( let i = 0; i < this.arrFech.length; i++){
      arrViento.push(datos[i][0]);
      arrTemperatura.push(datos[i][1]);
      arrRadiacion.push(datos[i][2])
      arrPrecipitacion.push(datos[i][3]);
      arrHumedad_ambiente.push(datos[i][4]);
      arrHumedad_suelo.push(datos[i][5]);
      arrLluvia.push(datos[i][6]);
    } 
    const fecha2= []
    

    for(let j=0; j<this.arrFech.length; j++){
      fecha2.push(moment.utc(this.arrFech[j]).valueOf());
     
     
  } 
    this.optionsC = {
      chart: {
        type: 'spline',
        height: 369.8,
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
        categories: this.arrFech.reverse()
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          },
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
        data: arrRadiacion.reverse(),
        tooltip: {
          pointFormat: 'Luminosidad :{point.y:.0f}%'
      }
      }, {
        name: 'Lluvia',
        data: arrLluvia.reverse(),
        tooltip: {
          pointFormat: 'Lluvia :{point.y:.0f}%'
      }
      },{
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

