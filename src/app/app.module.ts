import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { from } from 'rxjs';

//Componentes
import { AppComponent } from './app.component';
import { MapComponent } from './@core/components/map/map.component';
import { InstitucionComponent } from './@core/components/institucion/institucion.component';
import { HeaderComponent } from './@core/components/shared/header/header.component';
import { SidenavListComponent } from './@core/components/shared/sidenav-list/sidenav-list.component';
import { FooterComponent } from './@core/components/shared/footer/footer.component';
import { EstacionesComponent } from './@core/components/estaciones/estaciones.component';

//Modulos
import { MaterialModule } from './material.module';

//Servicios
import { PopUpService } from '@core/services/pop-up.service';
import { MarkerService } from './@core/services/marker.service';
import { EstacionComponent } from './@core/components/estaciones/estacion/estacion.component';
import { TablaDatosComponent } from './@core/components/estaciones/estacion/tabla-datos/tabla-datos.component';



@NgModule({
  entryComponents:[
    EstacionComponent
  ],
  declarations: [
    AppComponent,
    MapComponent,
    InstitucionComponent,
    HeaderComponent,
    SidenavListComponent,
    FooterComponent,
    EstacionesComponent,
    EstacionComponent,
    TablaDatosComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    AppRoutingModule,
    MarkerService,
    PopUpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
