import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule , ReactiveFormsModule}   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RegisterComponent } from './register/register.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

import { CitaComponent } from './cita/cita.component';

import { UsuariosComponent } from './usuarios/usuarios.component';

import { ReporteComponent } from './reporte/reporte.component';

import { PendientesComponent } from './pendientes/pendientes.component';
import { NotificacionesComponent } from './notificacion/notificacion.component';

import { SharedComponent } from './shared/shared.component';

import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/resetpassword/resetpassword.component';
import { CollectComponent } from './auth/collect/collect.component';


import * as $ from "jquery";

import {CalendarModule} from 'primeng/calendar';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {CardModule} from 'primeng/card';
import {FieldsetModule} from 'primeng/fieldset';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ConfiguracionComponent,
    CitaComponent,
    UsuariosComponent,
    ReporteComponent,
    LoginComponent,
    ResetPasswordComponent,
    CollectComponent,
    PendientesComponent,
    NotificacionesComponent,
    SharedComponent

  ],
  imports: [
    GraphQLModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    CalendarModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    CardModule,
    FieldsetModule,
    DialogModule,
    CheckboxModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
