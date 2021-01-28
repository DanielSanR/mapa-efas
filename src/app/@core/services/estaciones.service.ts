import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prototipo } from '@core/models/prototipo';


@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  url: string;


  constructor(private _http: HttpClient) { 
    this.url = 'http://ambient.siliconmisiones.gob.ar/api/datoAmbientalPrototiposPorInstitucion/';
  }

  
  
  getPrototypeInstitution(institution_id:number):Observable<Prototipo[]> {
    return this._http.get<Prototipo[]>(this.url+institution_id);
  }


}
