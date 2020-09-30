import  {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { Institucion } from '@core/models/institucion';

@Injectable()
export class InstitucionesService{

	public url: string;

	constructor(
		public _http: HttpClient){
		this.url = 'http://educaciondigitalmisiones.com:50000/';


	}

	getInstitucion():Observable<Institucion[]> {
		return this._http.get<Institucion[]>(this.url+'institucion/');
	}
}
