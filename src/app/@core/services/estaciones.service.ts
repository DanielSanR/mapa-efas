import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estacion } from '@core/models/estacion';
import stationsfrominstitution from '@core/json/stations.json';

@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  url: string;
  stations_from_institution: Estacion[] = [];

  public stations: Estacion[] = stationsfrominstitution;
  


  constructor(private _http: HttpClient) { 
    /* //TODO */
    this.url = '';
  
  }


  /* getStationsInstitution(institution_id:string):Observable<Estacion[]> {
    return this._http.get<Estacion[]>(this.url+'prototipo/'+institution_id);
  } */


  getStationsInstitution(institution_id:string):any {
    return this.stations
  }


}
