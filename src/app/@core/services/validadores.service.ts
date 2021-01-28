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

  validacionFechaDesde(fecha1: string, fecha2: string, check: string, min: string, max: string) {
    // tuve que hacer esta funcion medio engorrosa con if anidados, porque si lo hago en varias funciones, los validadores se sobreescriben
    // o no funciona correctamente si uso [min] [max].Por el momento es la solucion que encontré a este problema.
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
