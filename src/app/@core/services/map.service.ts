import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {


  private map;

  lat = -27.3689659;
  lng = -55.8975532;
  zoom = 16;

  constructor() {  }


  buildMap() {

    this.map = L.map('map').setView([this.lat, this.lng], this.zoom);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    

    let marker = L.marker([this.lat, this.lng]).addTo(this.map);
    marker.bindPopup('A pretty CSS3 popup.<br> Easily customizable.').openPopup();

    let otromarker = L.marker([-27.3676498,-55.8967229]).addTo(this.map);
    otromarker.bindPopup('OTRO MARCADOR.').openPopup();
  }
}