import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Institucion } from '@core/models/institucion';
import { PopUpService } from '@core/services/pop-up.service';
import { Router } from '@angular/router';
import { Prototipo } from '@core/models/prototipo';
import { MatDialog } from '@angular/material/dialog';
import { EstacionComponent } from '@core/components/estaciones/estacion/estacion.component';



//icono para pop up - a elegir y fixear
var myIcon = new L.icon({
  iconUrl: 'assets/images/markers_maps/marker_icon_map.png',
  iconRetinaUrl: 'assets/images/markers_maps/marker_icon_map.png',
  iconSize: [30, 30],
  popupAnchor: [0, -14],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = myIcon;

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  
  constructor(private _popupService: PopUpService, 
              private router: Router,
              public dialog: MatDialog ) { }


  makeInstitutionsMarkers(map: L.map ,institutionsArray:Institucion[] ) {

    institutionsArray.forEach(element => {

      let marker = L.marker([element.latitud, element.longitud]);

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


  makeStationsMarkers(mapStation: L.map ,stationsArray:Prototipo[], institution_id:number ) {

    stationsArray.forEach(element => {
      
      let marker = L.marker([element.latitud, element.longitud]);

      marker.bindPopup(this._popupService.makeStationsPopup(element));

      marker.on("popupopen", (e) => {
        let popUp = e.target.getPopup();
        popUp.getElement().querySelector("#btnOpenDialogStation").addEventListener("click", () => {
          this.openDialog(element, institution_id);
        });
      })

      marker.addTo(mapStation);
    })
  }

  public openDialog(element: Prototipo, institution_id:number): void {
    let dialogRef = this.dialog.open( EstacionComponent, {
      width: '700px',
      data: { element, institution_id }
    });
  }

}
