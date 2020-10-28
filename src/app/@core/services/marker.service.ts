import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Institucion } from '@core/models/institucion';
import { PopUpService } from '@core/services/pop-up.service';
import { Router } from '@angular/router';
import { Estacion } from '@core/models/estacion';

//icono para pop up - a elegir y fixear
var myIcon = new L.icon({
  iconUrl: 'assets/images/icon-green.png',
  iconRetinaUrl: 'assets/images/icon-green.png',
  iconSize: [30, 32],
  popupAnchor: [0, -14],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = myIcon;

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  
  constructor(private _popupService: PopUpService, private router: Router) { }


  makeInstitutionsMarkers(map: L.map ,usersArray:Institucion[] ) {

    usersArray.forEach(element => {
      
      let marker = L.marker([element.lat, element.long]);

      marker.bindPopup(this._popupService.makeInstitutionsPopup(element));

      marker.on("popupopen", (e) => {
        let popUp = e.target.getPopup();
        popUp.getElement().querySelector("#btnRedirectStation").addEventListener("click", () => {
          this.redirectStation(element.id);
        });
      })

      marker.addTo(map);

    })
  }

  
  redirectStation(id:number){
    this.router.navigate(['/estaciones',id]);
  }


  makeStationsMarkers(mapStation: L.map ,stationsArray:Estacion[] ) {

    stationsArray.forEach(element => {
      
      let marker = L.marker([element.lat, element.lng]);

      marker.bindPopup(this._popupService.makeStationsPopup(element));

      marker.on("popupopen", (e) => {
        let popUp = e.target.getPopup();
        popUp.getElement().querySelector("#btnModalDataStation").addEventListener("click", () => {
          this.modalDataStation();
        });
      })

      marker.addTo(mapStation);

    })
  }

  modalDataStation(){
    console.log('MAS DATOS');
  }

}
