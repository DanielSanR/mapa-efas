import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prototipo } from '@core/models/prototipo';

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
     // simulamos la API usando 2 json distintos
    return this._http.get<any>('assets/jsons/datos_prototipo' + id + '.json');
}

}
