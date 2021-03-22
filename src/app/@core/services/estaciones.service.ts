import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prototipo } from '@core/models/prototipo';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  url: string;


  constructor(private _http: HttpClient) { 
    this.url = environment.BASE_URL+'datoAmbientalPrototiposPorInstitucion/';
  }

  
  
  getPrototypeInstitution(institution_id:number):Observable<Prototipo[]> {
    return this._http.get<Prototipo[]>(this.url+institution_id);
  }


}
