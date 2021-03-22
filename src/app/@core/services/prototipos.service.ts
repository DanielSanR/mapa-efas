import  {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable'; 
import { Prototipo } from '@core/models/prototipo';
import { environment } from '../../../environments/environment';


@Injectable()
export class PrototiposService{
 
	

	constructor( private _http: HttpClient ) {
	 
	}
 
	getInstitucion(id:number):Observable<Prototipo[]> {
		return this._http.get<Prototipo[]>(environment.BASE_URL+'datoAmbientalPrototiposPorInstitucion/'+id);
	}
	
}
