import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Institucion } from '@core/models/institucion';
import { PopUpService } from '@core/services/pop-up.service';
import { Router } from '@angular/router';



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

}
