import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
 
 

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  isInstitucion(control: FormControl): {[s: string]: boolean} {
    if (typeof(control.value.id) === 'undefined') {
      return {
        NoSelect : true
      }
    }
    return  (null);


  }
 
clima(lluvia:number,humedad:number,precipitacion:number, hora:number) : number{
let estado = 0;
 const lluviaC = lluvia;
 const humedadC = humedad;
 const precipitacionC = precipitacion;
 const horaC = hora;
 if ((horaC>= 21) || ( horaC < 8) ) { estado = 3} else { estado =2 }
 
 if ((lluviaC >= 70) && (humedadC >= 70)){
    
    if(((horaC < 21) && (horaC >= 8)) || (precipitacionC >= 1)) { //  lluvia
      
          estado = 1; //lluvia
    }
    else if ( ((horaC < 8)  || (horaC >= 21)) && (precipitacionC >= 1)) { 
     
         estado = 1; //lluvia
    } 

    else { estado = 3 }
    
 }
 return estado
}
  validacionFechaDesde(fecha1: string, fecha2: string, check: string, min: string, max: string) {
    return (FormGroup: FormGroup) => {
      const checkbox = FormGroup.controls[check];
      const f1 = FormGroup.controls[fecha1];
      const f2 = FormGroup.controls[fecha2];
      const minc = min;
      const maxc = max;
 
      if( f1.value === null){
        f2.setErrors({required: true});
      }
      else if(f2.value === null ) {
        f2.setErrors({required: true});
      }
      else {
        if ( (f2.value.format() <= f1.value.format()) && (checkbox.value === true )) {
          f2.setErrors({esMenor: true});

        }
      else if (f2.value.format() < minc && (checkbox.value === true )){
        f2.setErrors({outRangeMin: true});
      }
      else if (f2.value.format() > maxc && (checkbox.value === true ) ) {
        f2.setErrors({outRangeMax: true});
      }
       else {
           f2.setErrors(null);
        }


      }


    }

  }
}
