import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes
import { InstitucionComponent } from './@core/components/institucion/institucion.component';
import { EstacionesComponent } from './@core/components/estaciones/estaciones.component';
import { DatosComponent } from './@core/components/datos/datos.component';
 

const routes: Routes = [
		{path: '', component: InstitucionComponent},
		{path: 'institucion', component: InstitucionComponent},
		{path: 'estaciones/:id', component: EstacionesComponent},
		{path: 'datos', component: DatosComponent},
		{path: '**', component: InstitucionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
