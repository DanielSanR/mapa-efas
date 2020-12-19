import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrototipoDatos } from '@core/models/prototipoDatos';


@Injectable({
  providedIn: 'root'
})
export class EstacionService {

  url: string;


  constructor(private _http: HttpClient) { 
    this.url = 'http://ambient.siliconmisiones.gob.ar/api/datoAmbientalPrototipo/';
  }


  //TODO: descomentar
  getPrototypeLastData(prototype_id:number, current_date_formatted:any):Observable<PrototipoDatos> {
    /* return this._http.get<any>(this.url+prototype_id+'/'+current_date_formatted); */
    return this._http.get<PrototipoDatos>('assets/jsons/datosDelDia.json');
  }

 

}
