import  {Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { Institucion } from '@core/models/institucion';
import { environment } from '../../../environments/environment';


@Injectable()
export class InstitucionesService{

	public url: string;
	

	constructor( private _http: HttpClient ) {
		this.url = environment.BASE_URL+'institucionTemporal';
	}

	
	getInstitucion():Observable<Institucion[]> {
		return this._http.get<Institucion[]>(this.url);
	}


}






