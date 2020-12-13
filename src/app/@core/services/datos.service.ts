import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable  } from 'rxjs';
import { Prototipo } from '@core/models/prototipo';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
 
@Injectable({
  providedIn: 'root'
})
export class DatosService {
 
  url: string;


  constructor(private _http: HttpClient) {
    /* //TODO */
    this.url = '';

  }



  getProtoipoByInstitucion(): Observable<Prototipo[]> {
    return this._http.get<any>('assets/jsons/datos.json');
  }

  getProtoipoByID(id: number): Observable<Prototipo[]> {
 

    return this._http.get<any>('assets/jsons/datos_prototipo' + id + '.json');
}

getDatos(id: number ): Observable<Prototipo[]> {
  return this._http.get<any>('assets/jsons/datos_prototipo' + id + '.json');
}
getDatosRangeDate(id: number ): Observable<Prototipo[]> {
  return this._http.get<any>('assets/jsons/datos_prototipo' + id + '.json');
}

getDatosHorarios(): Observable<Prototipo[]> {
  return this._http.get<any>('assets/jsons/datos_horarios_prototipo1.json');
}
}
