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
    this.url = 'asd.com/';
  
  }


  //TODO: descomentar
  /* getPrototypeLastData(prototype_id:number, current_date_formatted:any):Observable<any[]> {
    return this._http.get<any[]>(this.url+'prototipo/'+prototype_id+'/'+current_date_formatted);
  } */

  //TODO: DATOS LOCALES 'assets/jsons/*'
  getPrototypeLastData(prototype_id:number, current_date_formatted:any):Observable<any[]> {
    return this._http.get<any[]>('assets/jsons/datosDelDia.json');
  }



}
