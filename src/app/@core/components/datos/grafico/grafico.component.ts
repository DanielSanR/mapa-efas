import { Component, OnDestroy, OnInit, Input, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent  {

  Highcharts: typeof Highcharts = Highcharts; // required
  chartOptions: Highcharts.Options; // required
  updateFlag: boolean; // optional boolean

  flag: boolean;
  optionsC: any;
  arrFech : any;
@Input() datos: any[] = [];
@Input() fechas: any;
  constructor(private cdref: ChangeDetectorRef) { }



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.addData();
 
}


 addData(){
  console.log("llama componet");
  this.arrFech = Object.values(this.fechas);
  const checkbox   = true;
  if (checkbox){
    const mDatos = new Array(this.arrFech.length);
    for ( let i = 0; i < this.arrFech.length; i++){
      mDatos[i] = new Array(3);
    }
    // matriz para almacenar  los datosAmbientales, guarda el ultimo dato ambiental de cada fecha
    // se hara mediante lastIndexOf y una funcion proximamente.
    for ( let i = 0; i < this.arrFech.length; i++){

        // tslint:disable-next-line: prefer-for-of
        for ( let j = 0; j < this.datos.length; j++){
            const datoc = moment(new Date(this.datos[j].datoxFecha.fecha)).format('YYYY-MM-DD');
            if (this.arrFech[i] === datoc){
              mDatos[i][0] = this.datos[j].datoxFecha.datosAmbientales.viento;
              mDatos[i][1] = this.datos[j].datoxFecha.datosAmbientales.temperatura;
              mDatos[i][2] = this.datos[j].datoxFecha.datosAmbientales.luz;
              mDatos[i][3] = this.datos[j].datoxFecha.datosAmbientales.precipitacion;
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
  // tomar la fecha del json
    const arrViento = [];
    const arrTemperatura = [];
    const arrLuz = [];
    const arrPrecipitacion = [];
    for ( let i = 0; i < this.arrFech.length; i++){
      arrViento.push(datos[i][0]);
      arrTemperatura.push(datos[i][1]);
      arrLuz.push(datos[i][2]);
      arrPrecipitacion.push(datos[i][3]);
    }

    this.optionsC = {
      chart: {
        type: 'spline',
        height: 300,
        zoomType: 'x',
        renderTo: 'container'
      },
      title: {
        text: 'Gráfico de datos agrometeorológicos de la EFA  Prototipo 1'
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Datos Agrupados por fecha'
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
          pointInterval: 24 * 3600 * 1000 * 1,
        }
      },
      series: [{
        name: 'Viento',
        data: arrViento,
        tooltip: {
          pointFormat: 'Vel. Viento 2m(km/h) {point.y:.1f}km/h'
      },
      }, {
        name: 'Temperatura',
        data: arrTemperatura,
        tooltip: {
          pointFormat: 'Temperatura : {point.y} ºC'
      }
      }, {
        name: 'Humedad',
        data: arrLuz,
        tooltip: {
          pointFormat: 'Humedad {point.y:.0f}%'
      }
      }, {
        name: 'Precipitación',
        data: arrPrecipitacion,
        tooltip: {
          pointFormat: 'Precipitación  {point.y:.0f}mm'
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

