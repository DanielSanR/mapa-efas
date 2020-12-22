import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { from } from 'rxjs';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field'; 
import { DatePipe } from '@angular/common';

//Componentes
import { AppComponent } from './app.component';
import { MapComponent } from './@core/components/map/map.component';
import { InstitucionComponent } from './@core/components/institucion/institucion.component';
import { HeaderComponent } from './@core/components/shared/header/header.component';
import { SidenavListComponent } from './@core/components/shared/sidenav-list/sidenav-list.component';
import { FooterComponent } from './@core/components/shared/footer/footer.component';
import { EstacionesComponent } from './@core/components/estaciones/estaciones.component';
import { DatosComponent } from './@core/components/datos/datos.component';
import { InicioComponent } from './@core/components/inicio/inicio.component';
 
//Modulos
import { MaterialModule } from './material.module';
import { TablaDatosComponent } from './@core/components/estaciones/estacion/tabla-datos/tabla-datos.component';
import { TablaComponent } from './@core/components/datos/tabla/tabla.component';
import { GraficoComponent } from './@core/components/datos/grafico/grafico.component';
 
//Servicios
import { PopUpService } from '@core/services/pop-up.service';
import { MarkerService } from './@core/services/marker.service';
import { EstacionComponent } from './@core/components/estaciones/estacion/estacion.component';
import { InstitucionesService } from '@core/services/institucion.service';
import * as Highcharts from 'highcharts';

import { HighchartsChartModule } from 'highcharts-angular'; 
import { GraficoHorarioComponent } from './@core/components/datos/grafico-horario/grafico-horario.component';
import { PrototiposService } from './@core/services/prototipos.service';



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
    DatosComponent,
    TablaDatosComponent,
    InicioComponent,
    TablaComponent,
    GraficoComponent,
    GraficoHorarioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    HighchartsChartModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    AppRoutingModule,
    MarkerService,
    PopUpService,
    InstitucionesService,
    PrototiposService,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
