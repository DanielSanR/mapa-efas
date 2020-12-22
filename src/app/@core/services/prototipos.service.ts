import  {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable'; 
import { Prototipo } from '@core/models/prototipo';


@Injectable()
export class PrototiposService{
 
	

	constructor( private _http: HttpClient ) {
	 
	}
 
	getInstitucion(id:number):Observable<Prototipo[]> {
		return this._http.get<Prototipo[]>('http://ambient.siliconmisiones.gob.ar/api/datoAmbientalPrototiposPorInstitucion/'+id);
	}
	
}
