import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { CrearPacienteComponent } from './pages/crear-paciente/crear-paciente.component';

const routes: Routes = [
  {path:'',redirectTo:'pacientes', pathMatch:"full"},
  { path: 'pacientes', component: PacientesComponent },
  { path: 'paciente/:id', component: PacienteComponent },
  { path: 'crearPaciente', component: CrearPacienteComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
