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
import Swal from 'sweetalert2'

import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
selector: 'app-pendientes',
templateUrl: './pendientes.component.html',
styleUrls: ['./pendientes.component.css'],
animations: [
        trigger('rotatedState', [
          state('rotated', style({ transform: 'rotate(-90deg)' }))
     ])
 ]
})
export class PendientesComponent implements OnInit {

  arrayCitas: any;
  mostrarTablaPendientes: boolean = true;
  mostrarcita: boolean = false;
  comentario: any;
  objCita: any;
  user: any;
  loading: boolean = false;
  actualizarcita: boolean = false;
  tramites: any;
  tramiteSeleccionado: any;
  estado_actual_cita: any;
  booleanconobservaciones: boolean = false;
  booleansinobservaciones: boolean = false;

  selectedrequisitos: any[] = [];
  requisitosvalidados: any = [];
  requisitos: any;
  estados: any;

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
   this.traertramites();
   this.traerestados();

    this.user = JSON.parse(this.sessionStorageService.get('usuario'));
       $(document).ready(function(){
          (<any>$(".modal")).modal({dismissible: false});
       });
       $(document).ready(function(){
         (<any>$(".tabs")).tabs();
       });


  }


    traerestados(){
      this.loading = true;
      this.estados = [];
      this.apollo.use('backproveedores').watchQuery({
        query: A.GET_ESTADOS,
        fetchPolicy: 'no-cache'
      })
        .valueChanges.subscribe(result => {
          this.asignarEstados(result);
        }, (error) => {
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error, favor de verificar su conexión a Internet.    </div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
        });
    }

    asignarEstados(data){
      for(var i = 0; i < data.data.estadosPersonalizados.length;i++){

          this.estados.push(
            {
              id: data.data.estadosPersonalizados[i].id,
              nombre: data.data.estadosPersonalizados[i].nombre
            }
          );


      }

      this.traerCitas();



     }


  traertramites(){
    setTimeout(() => {
      this.apollo.use('backproveedores').watchQuery({
        query: A.GET_TRAMITES_GENERAL, fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        this.asignarTramites(result);
      });
     }, 100);

  }

  asignarTramites(data){
    this.tramites = [];
    for(var i = 0; i < data.data.tramitesGeneral.length;i++){
      this.tramites.push(
        {
          value: data.data.tramitesGeneral[i].id,
          label: data.data.tramitesGeneral[i].nombre,
          requisitos: data.data.tramitesGeneral[i].requisitos
        }
      )
    }
  }

  cambioTramite(event){
    this.requisitos = [];
    let comprobado = this.tramites.find(tramite => parseInt(tramite.value) == parseInt(event.value));

    if(comprobado.requisitos.requisitos!=undefined){
      for(var i = 0; i < comprobado.requisitos.requisitos.length;i++){
        this.requisitos.push({
           nombre: comprobado.requisitos.requisitos[i].nombre_corto,
          value: false
        });
      }
    }else{
      for(var i = 0; i < comprobado.requisitos.length;i++){
        this.requisitos.push({
           nombre: comprobado.requisitos[i].nombre_corto,
          value: false
        });
      }
    }

  }

  traerCitas(){
    let date1 = new Date(2022,5,1);
    let date2 = new Date();
    date2.setDate(date2.getDate()  - 1);
    this.loading = true;
    let comprobado = this.estados.find(estado => estado.nombre == 'PENDIENTE' );

    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_REPORTE_CITAS,
      variables: {
        fecha_inicio: date1,
        fecha_fin: date2,
        id_estado: comprobado.id
      }, fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarDatosCitas(result);
      }, (error) => {
        this.loading = false;
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Folio no encontrado en el sistema, favor de volverlo a intentar.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });

  }

  asignarDatosCitas(data){
    this.arrayCitas = [];
    if(data.data.reportesCitas.length == 0){

    }else{
      for(var i = 0; i < data.data.reportesCitas.length;i++){
        let nombre = '';
        if(data.data.reportesCitas[i].tipo_persona=='F'){
          nombre = data.data.reportesCitas[i].nombre + ' ' + data.data.reportesCitas[i].primer_apellido;
          if(data.data.reportesCitas[i].segundo_apellido!=undefined){
            nombre = nombre + ' ' + data.data.reportesCitas[i].segundo_apellido;
          }
        }
        if(data.data.reportesCitas[i].tipo_persona=='M'){
          nombre =  data.data.reportesCitas[i].razon_social;

        }


        let estado = 'Registrada';
        if(data.data.reportesCitas[i].atendido){
          estado = 'Atendido';
        }
        if(data.data.reportesCitas[i].cancelado){
          estado = 'Cancelada';
        }
        this.arrayCitas.push(
          {
            id: data.data.reportesCitas[i].id,
            nombre: nombre,
            folio: data.data.reportesCitas[i].folio_general,
            hora: this.splithora(data.data.reportesCitas[i].hora),
            rfc: data.data.reportesCitas[i].rfc,
            tipo_persona: data.data.reportesCitas[i].tipo_persona,
            fecha: this.funcioncrearfecha(data.data.reportesCitas[i].fecha),
            dia: data.data.reportesCitas[i].fecha,
            telefono: data.data.reportesCitas[i].telefono,
            folio_general: data.data.reportesCitas[i].folio_general,
            union_tramite_configuracion: data.data.reportesCitas[i].union_tramite_configuracion,
            email: data.data.reportesCitas[i].email,
            tramite_confirmacion: data.data.reportesCitas[i].tramite_confirmacion,
            estado: data.data.reportesCitas[i].estado



          }
        );
      }

       this.arrayCitas.sort((a, b) => a.dia > b.dia);

    }




  }

  mostrarinformacioncita(cita){

    this.objCita = cita;
    this.requisitos = [];
    this.estado_actual_cita = this.objCita.estado;
    if(this.objCita.documentacion!=null){
      const aux = this.objCita.documentacion
      const array = Object.entries(aux);
      let arr1 = [];

      for(var i = 0; i < array.length;i++){
        arr1.push(
          {
            nombre: array[i][0],
            valor: array[i][1]
          }
        );
      }

      this.requisitosvalidados = arr1;
    }

    if(this.objCita.union_tramite_configuracion.tramite.requisitos.requisitos!=undefined){
      for(var i = 0; i < this.objCita.union_tramite_configuracion.tramite.requisitos.requisitos.length;i++){
        this.requisitos.push({
           nombre: this.objCita.union_tramite_configuracion.tramite.requisitos.requisitos[i].nombre_corto,
          value: false
        });
      }
    }else{
      for(var i = 0; i < this.objCita.union_tramite_configuracion.tramite.requisitos.length;i++){
        this.requisitos.push({
           nombre: this.objCita.union_tramite_configuracion.tramite.requisitos[i].nombre_corto,
          value: false
        });
      }
    }

    this.comentario = this.objCita.observacion;
    if (this.comentario == 'sin descripción') {
      this.comentario = '';
    }
    $(document).ready(function(){
      (<any>$("#comentario")).characterCounter();

    });
    this.mostrarTablaPendientes = false;
    this.mostrarcita = true;
    let comprobado = this.tramites.find(tramite => parseInt(tramite.value) == parseInt(this.objCita.union_tramite_configuracion.tramite.id));
    this.tramiteSeleccionado = comprobado.value;
   }

  funcioncrearfecha(stringdate: any){
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    let fecha = new Date(stringdate);

    let dia21 = "";
    let anio21 = fecha.getFullYear().toString();
    let mes21 = "";

    if((fecha.getMonth()+1)<10){
     mes21 = "0"+(fecha.getMonth() + 1).toString();
    }else{
     mes21 = (fecha.getMonth() + 1).toString();
    }
     if((fecha.getDate()+1)<=10){
     dia21 = "0"+(fecha.getDate()).toString();
    }else{
     dia21 = (fecha.getDate()).toString();
    }

    return  dia21 +  "-" + mes21 + "-" + anio21 ;
  }

  splithora(stringdate: any){
    let diahora = stringdate;
    var str = diahora;
    var res = str.split(":");
     let horacita = res[0] + ":" + res[1];
    return  horacita ;
  }

  registrarComentario() {
    if(this.comentario!=undefined && (this.comentario!=undefined && this.comentario.length>0)){
      this.apollo.use('backproveedores')
        .mutate({
          mutation: N.UPDATE_OBSERVACION,
          variables: {
            id: this.objCita.id,
            observacion: this.comentario,
            id_usuario: this.user.id
          }
        }).subscribe(result => {
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp; Se ha agregado el comentario a la cita.</div></span>';
          M.toast({ html: toastHTML , displayLength:40000});

        }, (error) => {
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al guardar el comentario, favor de intentarlo de nuevo.</div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
        });
    }

  }


  cancelarCita() {
    this.loading = true;

  }



    aplicarCita() {
      this.loading = true;
      if(this.booleanconobservaciones){
        let that = this
        if((this.comentario!=undefined && (this.comentario!=undefined && this.comentario.length>0) ) || (this.selectedrequisitos.length>0)){
          this.registrarComentario();
         this.registrarrequisitos();
        }else{
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success btnok',
              cancelButton: 'btn btn-danger btncancel'
            },
            buttonsStyling: false
          })
          swalWithBootstrapButtons.fire({
            text: '¿Esta seguro de aplicar la cita sin comentario y sin registrar requisitos?',
            confirmButtonText: 'Aplicar',
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
          }).then((result) => {
            if (result.isConfirmed) {
              that.registrarComentario();
             that.registrarrequisitos();
           }else{
             that.loading = false;
           }
          })
        }

      }


      if(this.booleansinobservaciones){
        let estado = this.estados.find(estado => estado.nombre.toUpperCase() == 'SIN OBSERVACIONES');
        this.apollo.use('backproveedores')
          .mutate({
            mutation: N.UPDATE_ESTADO_CITA,
            variables: {
              id: this.objCita.id,
              id_estado: estado.id,
              id_usuario: this.user.id
            }
          }).subscribe(result => {

            this.atenderCita();
        
          }, (error) => {
            var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al finalizar la cita, favor de intentarlo de nuevo.</div></span>';
            M.toast({ html: toastHTML , displayLength:40000});
            this.loading = false;

          });
      }
    }


    registrarrequisitos(){
      let objenvio = {};
      for(var i = 0; i < this.requisitos.length;i++){
        let comprobado = this.selectedrequisitos.find(requisito => requisito == this.requisitos[i].nombre );
        if(comprobado!=undefined){
          objenvio[this.requisitos[i].nombre] = true;
        }else{
          objenvio[this.requisitos[i].nombre] = false;
        }
      }


      this.apollo.use('backproveedores')
        .mutate({
          mutation: N.UPDATE_REQUISITOS_CITA,
          variables: {
            id: this.objCita.id,
            documentacion: objenvio,
            id_usuario: this.user.id
          }
        }).subscribe(result => {
          this.continuarEstadoCita();

        }, (error) => {
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al finalizar la cita, favor de intentarlo de nuevo.</div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
          this.loading = false;

        });
    }

    continuarEstadoCita(){

      let estado = this.estados.find(estado => estado.nombre.toUpperCase() == 'CON OBSERVACIONES');
      this.apollo.use('backproveedores')
        .mutate({
          mutation: N.UPDATE_ESTADO_CITA,
          variables: {
            id: this.objCita.id,
            id_estado: estado.id,
            id_usuario: this.user.id
          }
        }).subscribe(result => {
           this.atenderCita()
        }, (error) => {
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al finalizar la cita, favor de intentarlo de nuevo.</div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
          this.loading = false;

        });

    }


    atenderCita(){

      this.apollo.use('backproveedores')
        .mutate({
          mutation: N.ATENDER_CITA,
          variables: {
            id: this.objCita.id,
            tramite_confirmacion: this.tramiteSeleccionado,
            id_usuario: this.user.id
          }
        }).subscribe(result => {
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp; La cita se ha marcado como finalizada.</div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
          this.loading = false;
          this.actualizarcita = true;
          this.recargar();

        }, (error) => {
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al finalizar la cita, favor de intentarlo de nuevo.</div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
          this.loading = false;

        });


    }


    recargar(){
      this.traerCitas();

      this.mostrarTablaPendientes = true;
      this.mostrarcita = false;
    }

    sinobservaciones(){
      this.booleanconobservaciones = false;
      this.booleansinobservaciones = true;
    }

    conobservaciones(){
      $(document).ready(function(){
        (<any>$("#comentario")).characterCounter();

      });
      this.booleanconobservaciones = true;
      this.booleansinobservaciones = false;
    }



}
