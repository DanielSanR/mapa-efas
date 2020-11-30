import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet'; 

//services
import { EstacionesService } from '@core/services/estaciones.service';
import { MarkerService } from '@core/services/marker.service';
import { Prototipo } from '@core/models/prototipo';


@Component({
  selector: 'app-estaciones',
  templateUrl: './estaciones.component.html',
  styleUrls: ['./estaciones.component.css']
})
export class EstacionesComponent implements OnInit {

  institution_id: number;

  public mapStation;

  stationsArray: Prototipo[] = [];

  
  constructor(private activatedRoute: ActivatedRoute, 
              private _estacionesService: EstacionesService, 
              private _markerService: MarkerService) { 

    this.activatedRoute.params.subscribe(params => {
      this.institution_id = params['id'];
    })

  }

  ngOnInit(): void {
    this.initMap();
    this.loadStations();
  }


  private initMap(): void {
    
    this.mapStation = L.map('mapStation').setView([-27.1078918, -54.5039398], 8);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    tiles.addTo(this.mapStation);
  }
  

  private loadStations():void {
    this._estacionesService.getPrototypeInstitution(this.institution_id).subscribe( response => {
      this.stationsArray = response;
      this._markerService.makeStationsMarkers(this.mapStation, this.stationsArray, this.institution_id);

    },
    error => {
      console.log(<any>error)
    });
  }
  

  
}
