import { Injectable } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {


  constructor() { }


  makeInstitutionsPopup(element: any): string {
    return `` +
      `<div style="font-weight: bold; text-align: center;">INSTITUCIONES</div><hr>` +
      `<strong>Institución: </strong>${ element.nombre }<br>` +
      `<strong>CUE: </strong>${ element.cue }<br>` +
      `<strong>Localidad: </strong>${ element.localidad }<br>` +
      `<strong>Departamento: </strong>${ element.departamento }<br><hr>` +
      `<button id="btnRedirectStation" 
          style="width:100%; height:30px; background-color:rgb(0,175,215); border-bottom-color: white; border: none; border-radius: 4px; font-weight: bold;">
            <span style="color:white;">ESTACIONES</span>
      </button>`
  }

  
  makeStationsPopup(element: any): string {
    return `` +
      `<div style="font-weight: bold; text-align: center;">ESTACIONES</div><hr>` +
      `<strong>Estacion: </strong>${ element.nombre }<br>` +
      `<strong>Localidad: </strong>${ element.localidad }<br>` +
      `<strong>Departamento: </strong>${ element.departamento }<br><hr>` +
      `<button id="btnOpenDialogStation"  
          style="width:195px; height:35px; background-color:rgb(0,175,215); border-bottom-color: white; border: none; border-radius: 4px; font-weight: bold;">
            <span style="color:white;">VER DATOS</span>
      </button>`
  }



}
