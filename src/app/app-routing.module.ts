import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { CitaComponent } from './cita/cita.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ReporteComponent } from './reporte/reporte.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/resetpassword/resetpassword.component';

import { PendientesComponent } from './pendientes/pendientes.component';
import { NotificacionesComponent } from './notificacion/notificacion.component';

import { SharedComponent } from './shared/shared.component';


import {CheckAuthGuard} from "./auth/guards/check-auth.guard";
import {VerifyAuthGuard} from "./auth/guards/verify-auth.guard";
import {VerifyPassGuard} from "./auth/guards/verify-pass.guard";

import {VerifyCitaGuard} from "./auth/guards/verify-cita.guard";
import {VerifyEncargadoGuard} from "./auth/guards/verify-encargado.guard";


const routes: Routes = [
  { path: 'cita', component: RegisterComponent, canActivate: [ VerifyCitaGuard ]},
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [ VerifyEncargadoGuard ]},
  { path: 'verificar', component: CitaComponent, canActivate: [ VerifyAuthGuard ]},
  { path: 'pendientes', component: PendientesComponent, pathMatch: 'full'},
  { path: 'notificaciones', component: NotificacionesComponent, canActivate: [ VerifyPassGuard ]},

  { path: 'shared', component: SharedComponent, pathMatch: 'full'},


  { path: 'resetpassword', component: ResetPasswordComponent, canActivate: [ VerifyPassGuard ]},

  { path: 'usuarios', component: UsuariosComponent, canActivate: [ VerifyEncargadoGuard ]},
  { path: 'reporte', component: ReporteComponent, canActivate: [ VerifyAuthGuard ]},
  { path: 'login', component: LoginComponent, canActivate: [ CheckAuthGuard ]},
  { path: '', redirectTo: '/cita', pathMatch: 'full' },
  { path: '**', redirectTo: '/cita'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
