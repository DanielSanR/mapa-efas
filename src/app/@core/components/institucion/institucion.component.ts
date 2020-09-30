import { Component, OnInit } from '@angular/core';
import { InstitucionesService } from '@core/services/institucion.service';
import { Institucion } from '@core/models/institucion';

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.css'],
  providers: [InstitucionesService]
})
export class InstitucionComponent implements OnInit {
	//public Instituciones:  Array<Institucion>;
  public response:any;
  public usersArray: Institucion[] = [];
  

  constructor(private _institucionesService: InstitucionesService) { }

  ngOnInit(): void {

  	this.cargarInstituto();
    

  }
cargarInstituto(){

  this._institucionesService.getInstitucion().subscribe(
  	result => {

  			this.response = result;
        //por cada objet que devuelve la api, agregamos a la clase Instituto
        this.response.forEach(element => {
          this.usersArray.push({
            id : element.id,
            descripcion: element.descripcion,
            cue : element.cue,
            lat : '0',
            long : '0',
          })
        })
        //como no tiene latlong, agregamos a mano para testear
  			this.usersArray[1].long = '-27.9359265';
        this.usersArray[1].lat = '-55.7744321';
  			console.log(this.usersArray[1]);
  			
  		},
  		error => {

  			console.log(<any>error)

  		}

  		);

 }
}
