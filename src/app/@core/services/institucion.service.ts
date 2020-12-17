import  {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { Institucion } from '@core/models/institucion';


@Injectable()
export class InstitucionesService{

	public url: string;
	

	constructor( private _http: HttpClient ) {
		this.url = 'http://ambient.siliconmisiones.gob.ar/api/institucion/';
	}

	//TODO: descomentar
	/* getInstitucion():Observable<Institucion[]> {
		return this._http.get<Institucion[]>(this.url);
	} */

	//TODO: DATOS LOCALES 'assets/jsons/*'
	getInstitucion():Observable<Institucion[]> {
		return this._http.get<Institucion[]>('assets/jsons/instituciones.json');
	}
	
}
