import { Component, OnInit } from '@angular/core';
import { InstitucionesService } from '@core/services/institucion.service';
import { Institucion } from '@core/models/institucion';
import * as L from 'leaflet'; 
import { MarkerService } from '@core/services/marker.service';
import coordenadasInstituciones from '@core/json/coordenadas.json';


//icono para pop up - a elegir y fixear
var tipoIcono = 'assets/images/marca_verde.png';
  var myIcon = new L.icon({
  iconUrl: 'assets/images/marca_verde.png',
  iconRetinaUrl: 'assets/images/marca_verde.png',
  iconSize: [24, 60],
  popupAnchor: [0, -14],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = myIcon;

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.css'],
  providers: [InstitucionesService]
})
export class InstitucionComponent implements OnInit {
  
  public map;

	//public Instituciones:  Array<Institucion>;
  public response:any;
   
  zoom = 16;
  public Coordenadas :any = coordenadasInstituciones;
  public usersArray: Institucion[] = [];
  

  constructor(private _institucionesService: InstitucionesService, private _markerService: MarkerService) { }

  ngOnInit(): void {
    
    this.initMap();
    this.cargarInstituto(); 
    
  }


  private initMap(): void {
    
    this.map = L.map('mapa').setView([-27.1078918, -54.5039398], 8); //coordenadas iniciales para centrar el mapa en la provincia

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    tiles.addTo(this.map);
  }


  cargarInstituto() {
    this._institucionesService.getInstitucion().subscribe(
      result => {

        this.response = result;

        //por cada objet que devuelve la api, agregamos a la clase Instituto - 
        this.response.forEach(element => {
          for (var i in this.Coordenadas) {
            //recorremos el json de coordenadas (podriamos usar unicamente el json, pero la idea es hacerlo dinamico utilizando la API)
            //mas adelante no haria falta recorrer el json.
            if (this.Coordenadas[i].cue == element.cue) {

              this.usersArray.push({
                id: element.id,
                descripcion: element.descripcion,
                cue: element.cue,
                lat: parseFloat(this.Coordenadas[i].lat),
                long: parseFloat(this.Coordenadas[i].lng),
              })
            }
          }
        })
        this._markerService.makeInstitutionsMarkers(this.map, this.usersArray);  

      },
      error => {

        console.log(<any>error)

      }
    );

    
  }


  
}
     
