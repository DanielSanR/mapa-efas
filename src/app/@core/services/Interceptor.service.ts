import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, timer, throwError, of } from 'rxjs';
import { retryWhen, tap, mergeMap } from 'rxjs/operators';

import { ErrorService} from '../services/error.service';
import { SpinnerService } from './spinner.service';
interface Error {
  titulo: string
  mensaje : string
}


@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {
  error$ : Error;
    retryDelay = 5000;
  retryMaxAttempts = 100;
  constructor( private _ERROR : ErrorService, private _SPINNER : SpinnerService
   
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   this._SPINNER.requestStarted();
    return next.handle(request)
      .pipe(
        this.retryAfterDelay(),
        tap((event) => { if(event instanceof HttpResponse) { this._SPINNER.requestEnded()}

        })
      );
  }

  retryAfterDelay(): any {
    return retryWhen(errors => {
      return errors.pipe(
        mergeMap((err, count) => {
          // intenta varias veces, si no conecta despues de 10 veces, deja de intentar.
          if (count === this.retryMaxAttempts) {
            this._SPINNER.requestEnded();
            this._SPINNER.resetSpinner();
            this._ERROR.enviarMensaje(this.error$ = {titulo: 'internet',
          mensaje: 'No se pudieron recuperar los datos, intente nuevamente más tarde.'
          });
            return throwError(err);
          }
          return of(err).pipe(
           
            tap(error =>  this.ConnectionTimeOut()),
            mergeMap(() => timer(this.retryDelay))
          );
        })
      );
    });
  }
  //funcion para manipular los mensajes de errores en DatosComponent
  ConnectionTimeOut(){
    this._SPINNER.requestStarted();
    this._ERROR.enviarMensaje(this.error$ = {
      titulo: 'internet',
      mensaje: 'Reintentando...' 
    })
    setTimeout(() => {
     this._SPINNER.requestEnded();
     this._SPINNER.resetSpinner();
      this._ERROR.enviarMensaje(this.error$ = {titulo: 'internet',
      mensaje: 'No se pudieron recuperar los datos, compruebe su conexión.'
      });
    }, 2000)
  }
  
}

