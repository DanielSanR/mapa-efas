import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }


  makeInstitutionsPopup(element: any): string {
    return `` +
      `<strong>Institución: </strong>${ element.nombre } <br>` +
      `<strong>CUE: </strong>${ element.cue } <br>` +
      `<strong>Localidad: </strong><br>` +
      `<strong>Departamento: </strong><br><hr>` +
      `<button id="btnRedirectStation"  
        style="width:190px; height:30px;">
            ESTACIONES
      </button>`
  }


}
