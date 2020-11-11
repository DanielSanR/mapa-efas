import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstacionService {

  url: string;


  constructor(private _http: HttpClient) { 
    //TODO: agregar url
    this.url = '';
  
  }


  //TODO: descomentar
  /* getStationsLastData(prototype_id:number, date_data:date):Observable<any[]> {
    return this._http.get<any[]>(this.url+'prototipo/'+prototype_id/date_data);
  } */


  

}
