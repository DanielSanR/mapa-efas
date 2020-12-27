import { Component, OnDestroy, OnInit } from '@angular/core';
import { InstitucionesService } from '@core/services/institucion.service';
import { Institucion } from '@core/models/institucion';
import * as L from 'leaflet'; 
import { MarkerService } from '@core/services/marker.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.css'],
  providers: [InstitucionesService]
})
export class InstitucionComponent implements OnInit, OnDestroy {
  
  public map;

  institutionsArray: Institucion[] = [];
  zoom = 16;
  institutionSubscription:Subscription;

  constructor(private _institucionesService: InstitucionesService, private _markerService: MarkerService) { }

  ngOnInit(): void {
    this.initMap();
    this.cargarInstituto(); 
  }

  ngOnDestroy(): void {
    this.institutionSubscription.unsubscribe();
  }


  private initMap(): void {
    
    this.map = L.map('mapa').setView([-27.1078918, -54.5039398], 8); //coordenadas iniciales para centrar el mapa en la provincia

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    tiles.addTo(this.map);
  }


  private cargarInstituto(): void {
    this.institutionSubscription = this._institucionesService.getInstitucion().subscribe(
      result => {
        this.institutionsArray = result;
        this._markerService.makeInstitutionsMarkers(this.map, this.institutionsArray);  
      },
      error => {
        console.log('error _institucionesService.getInstitucion: ',<any>error);
      }
    );
  }


}
     
