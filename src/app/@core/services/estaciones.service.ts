import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estacion } from '@core/models/estacion';


@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  url: string;


  constructor(private _http: HttpClient) { 
    //TODO: agregar url
    this.url = '';
  
  }

  
  //TODO: descomentar
  /* getStationsInstitution(institution_id:string):Observable<Estacion[]> {
    return this._http.get<Estacion[]>(this.url+'prototipo/'+institution_id);
  } */


  //TODO: DATOS LOCALES 'assets/jsons/*'
  getStationsInstitution(institution_id:number):Observable<Estacion[]> {
    return this._http.get<Estacion[]>('assets/jsons/stations.json');
  }


}
