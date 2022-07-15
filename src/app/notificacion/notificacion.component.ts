import { ComponentRef, ComponentFactoryResolver,ChangeDetectorRef, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter ,ElementRef , OnDestroy} from "@angular/core";
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { ActivatedRoute, Router} from '@angular/router';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import * as N from '../graphql/mutations';
import * as A from '../graphql/queries';
import {SelectItem} from 'primeng/api';
declare var M: any;
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from '../core/services/sessionstorage.service';

import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
selector: 'app-notificacion',
templateUrl: './notificacion.component.html',
styleUrls: ['./notificacion.component.css'],
animations: [
        trigger('rotatedState', [
          state('rotated', style({ transform: 'rotate(-90deg)' }))
     ])
 ]
})
export class NotificacionesComponent implements OnInit {
  notificaciones: any;
  fecha_notificacion: any;
  comentario: any;
  user: any;
  mostrarListadoNotificacion: boolean = true;
  mostrarCrearNotificacion: boolean = false;
  mensajeseleccionado: any;
  loading: boolean = false;

constructor(
  private CFR: ComponentFactoryResolver,
  private cdref: ChangeDetectorRef,
  private formBuilder: FormBuilder,
  private apollo?: Apollo,
  private _route?: ActivatedRoute,
  private _router?: Router,
  private sessionStorageService?: SessionStorageService,

   ) {
 }


 ngOnInit() {
   this.user = JSON.parse(this.sessionStorageService.get('usuario'));


   $(document).ready(function() {
     (<any>$(".modal")).modal({ dismissible: false });
   });

   this.traerNotificaciones();
  }

  traerNotificaciones(){
    this.loading = true;
       this.apollo.use('backproveedores').watchQuery({
        query: A.GET_NOTIFICACIONES, fetchPolicy: 'no-cache'
      })
      .valueChanges.subscribe(result => {
        this.asignarNotificaciones(result);
      });
  }

  asignarNotificaciones(data){
    this.notificaciones= [];
    for(var i = 0; i < data.data.logNotificaciones.length;i++){
      this.notificaciones.push(
        {
          mensaje: data.data.logNotificaciones[i].operacion.mensaje,
          fecha: data.data.logNotificaciones[i].operacion.fecha
        }
      );
    }
    this.loading = false;

  }

  enviarNotificacion(){
    this.loading = true;

    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.CREAR_NOTIFICACION,
        variables: {
          mensaje: this.comentario,
          fecha: this.fecha_notificacion,
          id_usuario: this.user.id
        }
      }).subscribe(result => {
        this.loading = false;
        this.regresar();
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp; Notificación enviada correctamente.</div></span>';
        M.toast({ html: toastHTML });
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al enviar la notificación.</div></span>';
        M.toast({ html: toastHTML });
      });

  }

  verCrearNotificacion(){
    $(document).ready(function(){
      (<any>$("#comentario")).characterCounter();

    });
    this.mostrarListadoNotificacion = false;
    this.mostrarCrearNotificacion = true;
  }

  regresar(){
    setTimeout(() => {
      this.traerNotificaciones();

    }, 100);

    this.fecha_notificacion = null;
    this.comentario = null;
    this.mostrarListadoNotificacion = true;
    this.mostrarCrearNotificacion = false;
  }

  cortarString(string, limite) {
    return string.length > limite ?
      string.substring(0, limite) + "..." :
      string;
  }

  mostrarmodalmensaje(mensaje) {
    this.mensajeseleccionado = mensaje;
     $(document).ready(function() {
      (<any>$('#modalvermensaje')).modal('open');
    });

  }

  validarFecha(){
    setTimeout(() => {
      if(this.fecha_notificacion!=undefined){
        let date1 = new Date(this.fecha_notificacion);
        let date2 = new Date();
        if (date1.getTime() < date2.getTime()){
          this.fecha_notificacion = null;
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp; La fecha limite no debe ser menor a la fecha inicial.    </div></span>';
          M.toast({html: toastHTML});
        }else{
          this.validarreportes();
  
        }
       }
    }, 100);


  }

  validarreportes(){
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_REPORTE_CITAS,
      variables: {
        fecha_inicio: this.fecha_notificacion,
        fecha_fin: this.fecha_notificacion
      },fetchPolicy: 'no-cache'
       })
    .valueChanges.subscribe(result => {
        this.asignarDatosReporte(result);
     }, (error) => {
       var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;No se tienen citas registradas en la fecha seleccionada.    </div></span>';
       M.toast({html: toastHTML});
      });
  }

  asignarDatosReporte(data){
    if(data.data.reportesCitas.length==0){
      this.fecha_notificacion = null;
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;No se tienen citas registradas en la fecha seleccionada.    </div></span>';
      M.toast({html: toastHTML});
    }
  }


}
