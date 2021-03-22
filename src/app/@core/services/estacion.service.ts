import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrototipoDatos } from '@core/models/prototipoDatos';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EstacionService {

  url: string;


  constructor(private _http: HttpClient) { 
    this.url = environment.BASE_URL+'datoAmbientalPrototipo/';
  }


  
  getPrototypeLastData(prototype_id:number, current_date_formatted:any):Observable<PrototipoDatos> {
    return this._http.get<any>(this.url+prototype_id+'/'+current_date_formatted);
  }

 

}
