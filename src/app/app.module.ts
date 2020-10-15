import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';



import { AppComponent } from './app.component';
import { MapComponent } from './@core/components/map/map.component';
import { InstitucionComponent } from './@core/components/institucion/institucion.component';
import { HeaderComponent } from './@core/components/shared/header/header.component';
import { from } from 'rxjs';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    InstitucionComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatTabsModule
  ],
  providers: [
    AppRoutingModule  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
