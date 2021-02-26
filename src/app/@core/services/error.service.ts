

 import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";
import { Subject } from "rxjs";
interface Error {
  titulo: string
  mensaje : string
}

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  error$ : Error;
  
  private enviarErrorSubject = new Subject<Error>();
  enviarErrorjeObservable = this.enviarErrorSubject.asObservable();


enviarMensaje(error : Error) {
this.error$ = error 
this.enviarErrorSubject.next(this.error$);
}

 
/*
  // Handling HTTP Errors using Toaster
  public handleError(err: HttpErrorResponse) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = "Something went wrong!";
    }
    console.log(errorMessage);
  }*/

  
}
 