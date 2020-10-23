import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }


  makeInstitutionsPopup(element: any): string {
    return `` +
      `<strong>Institución: </strong>${ element.descripcion } <br>` +
      `<strong>cue: </strong>${ element.cue } <br>` +
      `<button id="btnRedirectStation"  
        style="width:190px; height:30px;">
            ESTACIONES
      </button>`
  }


}
