import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { datoPorFecha } from '@core/models/datosPorFecha';

@Injectable({
  providedIn: 'root'
})
export class EstacionService {

  url: string;


  constructor(private _http: HttpClient) { 
    this.url = 'http://ambient.siliconmisiones.gob.ar/api/datoAmbientalPrototipo/';
  }


  //TODO: descomentar
  getPrototypeLastData(prototype_id:number, current_date_formatted:any):Observable<datoPorFecha[]> {
    return this._http.get<datoPorFecha[]>(this.url+prototype_id+'/'+current_date_formatted);
  }

  //TODO: DATOS LOCALES 'assets/jsons/*'
  /* getPrototypeLastData(prototype_id:number, current_date_formatted:any):Observable<any[]> {
    return this._http.get<any[]>('assets/jsons/datosDelDia.json');
  } */



}
