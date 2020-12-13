import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes
import { InstitucionComponent } from './@core/components/institucion/institucion.component';
import { EstacionesComponent } from './@core/components/estaciones/estaciones.component';
import { DatosComponent } from './@core/components/datos/datos.component';
import { InicioComponent } from './@core/components/inicio/inicio.component';

const routes: Routes = [
		{path: '', component: InicioComponent},
		{path: 'institucion', component: InstitucionComponent},
		{path: 'estaciones/:id', component: EstacionesComponent},
		{path: 'datos', component: DatosComponent},
		{path: 'datos/:inst_id/:protype_id', component: DatosComponent},
		{path: '**', component: InicioComponent},
		
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
