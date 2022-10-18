import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../core/services/sessionstorage.service';

import { Apollo } from 'apollo-angular';
import * as N from '../graphql/mutations';
import * as A from '../graphql/queries';
declare var M: any;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css']
})
export class CitaComponent implements OnInit {
  mensaje: any;
  innerWidth: any;
  cols: any[];
  items: any[];
  signos: any[] = [];
  folio: any;
  viewBtnValidar: boolean = false;
  div1buscarfolio: boolean = true;
  div2datoscita: boolean = false;
  btncomentario: boolean = false;
  cambioestatus: boolean = false;
  curp: string;
  id: number;
  tiempo: any;
  examenContestadoalmomento: any;
  mostrarcorrectas: boolean = false;
  mostrarbotonsiguiente: boolean = false;
  mostrarresultadosboton: boolean = false;
  mostrar: boolean = false;
  quitarpararesultados: boolean = true;
  siaprobo: boolean = false;
  mostrartest: boolean = false;
  aftercreacionpreguntas: boolean = false;
  loading: boolean = false;
  imagenes: Observable<any>;
  confExamen: Observable<any>;
  mostrarcronometro: boolean = false;
  esperaRespuesta: boolean = false;
  imageUrl: any;
  comentario: any;
  iphone: boolean = false;
  objAuxReturn: any;
  imgPhoto: boolean = false;
  objCita: any;
  cambioestatusdeprecated: boolean = false;
  user: any;
  date_cita: any;
  tramiteSeleccionado: any;
  tramites: any;

  booleanconobservaciones: boolean = false;
  booleansinobservaciones: boolean = false;

  estado_actual_cita: any;
  requisitos: any;
  estados: any;

  selectedrequisitos: any[] = [];
  requisitosvalidados: any = [];


  booleanfoliogeneral: boolean = true;
  booleannumerocita: boolean = false;

  requisitoscorrectos: any = [];
  requisitosincorrectos: any = [];

  usuario: any;



  constructor(
    private cdref: ChangeDetectorRef,
    private apollo?: Apollo,
    private _route?: ActivatedRoute,
    private _router?: Router,
    private sessionStorageService?: SessionStorageService,

  ) { }

  ngOnInit() {

    this.date_cita = (new Date()).toISOString().substring(0,10);
      this.requisitos = [];

    this.traertramites();
    this.traerestados();

    document.getElementById("divheader1").style.backgroundColor = "white";
    this.user = JSON.parse(this.sessionStorageService.get('usuario'));

    $(document).ready(function(){
      (<any>$(".tabs")).tabs();
    });

  }


  opcionfoliogeneral(){
    this.booleanfoliogeneral = true;
    this.booleannumerocita = false;
    this.limpiaropcionesbusqueda();
  }

  opcionnumerocita(){
    this.booleanfoliogeneral = false;
    this.booleannumerocita = true;
    this.limpiaropcionesbusqueda();
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
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error.    </div></span>';
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
    this.loading = false;

  }

  buscarFolioxDate(){

    if(this.user.rol.nombre.toUpperCase() == 'ENCARGADO'){
      this.loading = true;
      this.apollo.use('backproveedores').watchQuery({
        query: A.GET_CITA,
        variables: {
          folio_dia: this.folio,
          fecha: this.date_cita
        }, fetchPolicy: 'no-cache'
      })
        .valueChanges.subscribe(result => {
          this.asignarDatosCitas(result);
        }, (error) => {
          this.loading = false;
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Número de cita no encontrado en el sistema.    </div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
        });
    }

    if(this.user.rol.nombre.toUpperCase() == 'OPERADOR'){
      this.loading = true;
      this.apollo.use('backproveedores').watchQuery({
        query: A.GET_CITA,
        variables: {
          folio_dia: this.folio,
          fecha: new Date()
        }, fetchPolicy: 'no-cache'
      })
        .valueChanges.subscribe(result => {
          this.asignarDatosCitas(result);
        }, (error) => {
          this.loading = false;
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Folio no encontrado en el sistema.    </div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
        });
    }


  }

  buscarFolio() {
    this.loading = true;
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_CITA,
      variables: {
        folio_general: this.folio
      }, fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarDatosCitas(result);
      }, (error) => {
        this.loading = false;
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Folio no encontrado en el sistema.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  asignarDatosCitas(data: any) {
    this.booleanconobservaciones = false;
    this.booleansinobservaciones = false;
    if (data.data.citaPersonalizada.length==0) {
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Folio no encontrado en el sistema.    </div></span>';
      M.toast({ html: toastHTML , displayLength:40000});
      this.loading = false;
    } else {
      this.objCita = data.data.citaPersonalizada[0];
      this.estado_actual_cita = data.data.citaPersonalizada[0].estado;
      this.requisitos = [];
      this.requisitoscorrectos = [];
      this.requisitosincorrectos = [];
      if(this.objCita.documentacion!=null){
        const aux = this.objCita.documentacion
        const array = Object.entries(aux);
        let arr1 = [];
        for(var i = 0; i < array.length;i++){
          if(array[i][1]){
            this.requisitoscorrectos.push(
              {
                nombre: array[i][0],
                valor: array[i][1]
              }
            );
          }else{
            this.requisitosincorrectos.push(
              {
                nombre: array[i][0],
                valor: array[i][1]
              }
            );
          }
          arr1.push(
            {
              nombre: array[i][0],
              valor: array[i][1]
            }
          );
        }
        this.requisitosvalidados = arr1;
      }



      if(this.objCita.union_tramite_configuracion.tramiteGeneral.requisitos.requisitos!=undefined){
        for(var i = 0; i < this.objCita.union_tramite_configuracion.tramiteGeneral.requisitos.requisitos.length;i++){
          this.requisitos.push({
             nombre: this.objCita.union_tramite_configuracion.tramiteGeneral.requisitos.requisitos[i].nombre_corto,
            value: false
          });
        }
      }else{
        for(var i = 0; i < this.objCita.union_tramite_configuracion.tramiteGeneral.requisitos.length;i++){
          this.requisitos.push({
             nombre: this.objCita.union_tramite_configuracion.tramiteGeneral.requisitos[i].nombre_corto,
            value: false
          });
        }
      }
      let dia_actual = new Date();
      let dia_cita = new Date(this.objCita.fecha);

      let aniodia_actual = dia_actual.getFullYear();
      let mesdia_actual = dia_actual.getMonth();
      let diadia_actual = dia_actual.getDate();

      let aniodia_cita = dia_cita.getFullYear();
      let mesdia_cita = dia_cita.getMonth();
      let diadia_cita = dia_cita.getDate();
      if(this.user.rol.nombre.toUpperCase() == 'ENCARGADO'){
        document.getElementById("divheader1").style.backgroundColor = "#F1F1F1";
        document.getElementById("divheader2").style.backgroundColor = "white";
        this.div1buscarfolio = false;
        this.div2datoscita = true;
        this.loading = false;
        this.comentario = this.objCita.observacion;
        if (this.comentario == 'sin descripción') {
          this.comentario = '';
        }
        $(document).ready(function(){
          (<any>$("#comentario")).characterCounter();

        });
        let comprobado = this.tramites.find(tramite => parseInt(tramite.value) == parseInt(this.objCita.union_tramite_configuracion.tramiteGeneral.id));
        this.tramiteSeleccionado = comprobado.value;
      }


      if(this.user.rol.nombre.toUpperCase() == 'OPERADOR'){
        if(aniodia_actual == aniodia_cita && mesdia_actual == mesdia_cita && diadia_actual == diadia_cita){
          document.getElementById("divheader1").style.backgroundColor = "#F1F1F1";
          document.getElementById("divheader2").style.backgroundColor = "white";
          this.div1buscarfolio = false;
          this.div2datoscita = true;
          this.loading = false;
          this.comentario = this.objCita.observacion;
          if (this.comentario == 'sin descripción') {
            this.comentario = '';
          }
          $(document).ready(function(){
            (<any>$("#comentario")).characterCounter();

          });
          let comprobado = this.tramites.find(tramite => parseInt(tramite.value) == parseInt(this.objCita.union_tramite_configuracion.tramiteGeneral.id));
          this.tramiteSeleccionado = comprobado.value;
        }else{


          let dia21 = "";
          let anio21 = dia_cita.getFullYear().toString();
          let mes21 = "";

          if((dia_cita.getMonth()+1)<10){
           mes21 = "0"+(dia_cita.getMonth() + 1).toString();
          }else{
           mes21 = (dia_cita.getMonth() + 1).toString();
          }
           if((dia_cita.getDate()+1)<=10){
           dia21 = "0"+(dia_cita.getDate()).toString();
          }else{
           dia21 = (dia_cita.getDate()).toString();
          }

          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Cita no disponible para verificación, fecha de la cita: ' +dia21 +  "-" + mes21 + "-" + anio21+ ' .    </div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
          this.loading = false;

        }
      }




    }
  }

  limpiaropcionesbusqueda(){
    this.viewBtnValidar = false;
    this.date_cita = (new Date()).toISOString().substring(0,10);
    this.folio = null;

    



  }

  validarFolio() {
    this.viewBtnValidar = true;
  }

  validarFolioxDate(){
    if(this.user.rol.nombre.toUpperCase() == 'OPERADOR'){
      if(this.folio!=undefined){
        this.viewBtnValidar = true;
      }
    }
    if(this.user.rol.nombre.toUpperCase() == 'ENCARGADO'){
      if(this.date_cita!=undefined && this.folio!=undefined){
        this.viewBtnValidar = true;
      }
    }




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
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al guardar el comentario.</div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
        });
    }

  }

  funcioncrearfecha(stringdate: any) {
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let fecha = new Date(stringdate);
    let dia21 = "";
    let anio21 = fecha.getFullYear().toString();
    let mes21 = "";
    if ((fecha.getMonth() + 1) < 10) {
      mes21 = "0" + (fecha.getMonth() + 1).toString();
    } else {
      mes21 = (fecha.getMonth() + 1).toString();
    }
    if ((fecha.getDate() + 1) <= 10) {
      dia21 = "0" + (fecha.getDate()).toString();
    } else {
      dia21 = (fecha.getDate()).toString();
    }
    return dia21 + " de " + meses[fecha.getMonth()] + " del " + anio21;
  }

  splithora(stringdate: any) {
    let diahora = stringdate;
    var str = diahora;
    var res = str.split(":");
    let horacita = res[0] + ":" + res[1];
    return horacita;
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
           var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al finalizar la cita.</div></span>';
           M.toast({ html: toastHTML , displayLength:40000});
           this.loading = false;

         });
     }


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
        this.buscarFolio();
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al finalizar la cita.</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
        this.loading = false;

      });


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
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al finalizar la cita.</div></span>';
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
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al finalizar la cita.</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
        this.loading = false;

      });

  }

  recargar() {
    window.location.href = "/verificar";
  }

  cancelarCita() {
    this.registrarComentario();
    this.loading = true;

    this.cambioestatusdeprecated = true;
    this.cambioestatus = true;

  }


    traertramites(){
      this.apollo.use('backproveedores').watchQuery({
        query: A.GET_TRAMITES_GENERAL, fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        this.asignarTramites(result);
      });
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
