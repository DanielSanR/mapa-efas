import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable  } from 'rxjs';
import { Prototipo } from '@core/models/prototipo';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { PrototipoDatos } from '../models/prototipoDatos';
import { datoPorFecha } from '../models/datosPorFecha';
 
@Injectable({
  providedIn: 'root'
})
export class DatosService {
 
  url: string;
  

  constructor(private _http: HttpClient) {
    /* //TODO */
    this.url = 'http://192.168.10.116:50000/api';

  }



  getProtoipoByInstitucion(): Observable<Prototipo[]> {
    return this._http.get<any>('assets/jsons/datos.json');
  }

  getProtoipoByID(id: number): Observable<Prototipo[]> {
 

    return this._http.get<any>(this.url);
}

getDatos(id: number ): Observable<Prototipo[]> {
  return this._http.get<any>('assets/jsons/datos_prototipo' + id + '.json');
}
getByRange(id: number,start: Date, end : Date ): Observable<PrototipoDatos> {
  console.log('http://ambient.siliconmisiones.gob.ar/api/datoAmbientalPrototipo/1/'+start+'/'+end);
  return this._http.get<any>('http://ambient.siliconmisiones.gob.ar/api/datoAmbientalPrototipo/1/'+start+'/'+end);
}
getByDay(id: number,start: Date): Observable<PrototipoDatos> {
  return this._http.get<any>('http://ambient.siliconmisiones.gob.ar/api/datoAmbientalPrototipo/1/'+start);
}

getDatosHorarios(id: number): Observable<datoPorFecha[]> {
  return this._http.get<any>('http://ambient.siliconmisiones.gob.ar/api/datoAmbientalPrototipo/'+id);
}

}
