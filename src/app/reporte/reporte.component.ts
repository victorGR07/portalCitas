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
import { CreadorReporteExcel } from '../services/excel/creacionReporteExcel.service';
import { SessionStorageService } from '../core/services/sessionstorage.service';

import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
selector: 'app-reporte',
templateUrl: './reporte.component.html',
styleUrls: ['./reporte.component.css'],
animations: [
        trigger('rotatedState', [
          state('rotated', style({ transform: 'rotate(-90deg)' }))
     ])
 ]
})
export class ReporteComponent implements OnInit {
  form: FormGroup;

  date1: any;
  date2: any;
  es: any;
  tramites: any;
  tramiteSeleccionado: any;
  tramiteseleccionadolabel: any;
  mostrartabla: boolean = false;
  arrayCitas: any;
  usuarios = [];
  tipos_personas = [];
  estados = [];

  loading: boolean = false;
  operador: boolean = false;
  encargado: boolean = false;

  user: any;


constructor(
  private CFR: ComponentFactoryResolver,
  private cdref: ChangeDetectorRef,
  private formBuilder: FormBuilder,
  private sessionStorageService: SessionStorageService,
  private apollo?: Apollo,
  private _route?: ActivatedRoute,
  private _router?: Router,
  private creadorReporteExcel?: CreadorReporteExcel,



   ) {
 }


 ngOnInit() {

   this.user = JSON.parse(this.sessionStorageService.get('usuario'));
   this.traerestados();

   if(this.user!=undefined){
     if(this.user.rol.nombre.toUpperCase() == 'ENCARGADO'){
       this.encargado = true;
       this.form = this.formBuilder.group({
         fecha_inicio: [null, [ Validators.required ]],
         fecha_fin: [null, [ Validators.required ]],
         id_usuario: [-1, []],
         id_tramite: [-1, []],
         id_tipo_persona: [-1, []],
         id_estado: [-1, []],

        });
     }
     if(this.user.rol.nombre.toUpperCase() == 'OPERADOR'){
       this.operador = true;

       this.loading = true;
       this.mostrartabla = false;
       let objEnvio = {
         fecha_inicio: new Date(),
         fecha_fin: new Date()
       }

       this.apollo.use('backproveedores').watchQuery({
         query: A.GET_REPORTE_CITAS,
         variables: objEnvio, fetchPolicy: 'no-cache'
          })
       .valueChanges.subscribe(result => {
           this.asignarDatosReporte(result);
        }, (error) => {

          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error en la obtención de Citas.    </div></span>';
          M.toast({html: toastHTML});
         });


     }
    }


   this.traertramites();
   this.traerusuarios();

   this.tipos_personas = [
     {
       nombre: 'Persona Fisica', value: 'F',
     },
     {
        nombre: 'Persona Moral', value: 'M',
     }
   ]

   this.es = {
        firstDayOfWeek: 1,
        dayNames: [ "Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado" ],
        dayNamesShort: [ "Dom","Lun","Mar","Mié","Jue","Vie","Sáb" ],
        dayNamesMin: [ "D","L","M","X","J","V","S" ],
        monthNames: [ "Enero ","Febrero ","Marzo ","Abril ","Mayo ","Junio ","Julio ","Agosto ","Septiembre ","Octubre ","Noviembre ","Diciembre " ],
        monthNamesShort: [ "Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic" ],
        today: 'Hoy',
        clear: 'Borrar'
    }

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
        M.toast({ html: toastHTML });
      });
  }

  asignarEstados(data){
    for(var i = 0; i < data.data.estadosPersonalizados.length;i++){
      if(data.data.estadosPersonalizados[i].nombre.includes('OBSERVACIONES')){
        this.estados.push(
          {
            id: data.data.estadosPersonalizados[i].id,
            nombre: 'CITA ATENDIDA ' + data.data.estadosPersonalizados[i].nombre
          }
        );
      }else{
        this.estados.push(
          {
            id: data.data.estadosPersonalizados[i].id,
            nombre: data.data.estadosPersonalizados[i].nombre
          }
        );
      }




    }
    this.loading = false;

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

  cambioHora(){
  }

  cambioTramite(event){
   const resultado = this.tramites.find(tramite => tramite.value == String(this.tramiteSeleccionado));
   this.tramiteseleccionadolabel = resultado;
   this.apollo.use('backproveedores').watchQuery({
     query: A.GET_REPORTE_X_TRAMITE,
     variables: {
        id_tramite: this.tramiteseleccionadolabel.value
      }, fetchPolicy: 'no-cache'
      })
   .valueChanges.subscribe(result => {
       this.asignarDatosCitas(result);
    }, (error) => {

      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error en la obtención de Citas.    </div></span>';
      M.toast({html: toastHTML});
     });
  }

  asignarDatosCitas(data){
    this.arrayCitas = [];
    for(var i = 0; i < data.data.citasByTramite.length;i++){
      let nombre = '';
      if(data.data.citasByTramite[i].tipo_persona=='F'){
        nombre = data.data.citasByTramite[i].nombre + ' ' + data.data.citasByTramite[i].primer_apellido;
        if(data.data.citasByTramite[i].segundo_apellido!=undefined){
          nombre = nombre + ' ' + data.data.citasByTramite[i].segundo_apellido;
        }
      }
      if(data.data.citasByTramite[i].tipo_persona=='M'){
        nombre =  data.data.citasByTramite[i].razon_social;

      }

      let estado_nombre = '';
      if(data.data.estadosPersonalizados[i].nombre.includes('OBSERVACIONES')){
        estado_nombre = 'CITA ATENDIDA '+ data.data.citasByTramite[i].estado.nombre;
      }else{
        estado_nombre = data.data.citasByTramite[i].estado.nombre;
      }

      this.arrayCitas.push(
        {
          id: data.data.citasByTramite[i].id,
          nombre: nombre,
          folio: data.data.citasByTramite[i].folio_general,
          hora: this.splithora(data.data.citasByTramite[i].hora),
          rfc: data.data.citasByTramite[i].rfc,
          tipo_persona: data.data.citasByTramite[i].tipo_persona,
          fecha: this.funcioncrearfecha(data.data.citasByTramite[i].fecha),
          atendido: data.data.citasByTramite[i].atendido,
          cancelado: data.data.citasByTramite[i].cancelado,
          telefono: data.data.citasByTramite[i].telefono,
          email: data.data.citasByTramite[i].email,
          estado: estado_nombre,
          documentacion: data.data.citasByTramite[i].documentacion,


        }
      );
    }

    this.mostrartabla = true;

  }

  traerusuarios() {
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_USUARIOS,
      variables: {
        id_rol: 2
      },
       fetchPolicy: 'network-only'
    })
      .valueChanges.subscribe(result => {
        this.asignarUsuarios(result);
      });
  }

  asignarUsuarios(data) {
    this.usuarios = [];
    let nombrecompleto = '';

    for (var i = 0; i < data.data.usuarioPersonalizado.length; i++) {
      nombrecompleto = data.data.usuarioPersonalizado[i].nombre + ' ' + data.data.usuarioPersonalizado[i].primer_apellido;
      if(data.data.usuarioPersonalizado[i].segundo_apellido!=undefined){
        nombrecompleto = nombrecompleto + ' ' + data.data.usuarioPersonalizado[i].segundo_apellido;
      }
      this.usuarios.push(
        {
          id: data.data.usuarioPersonalizado[i].id,
          nombre: data.data.usuarioPersonalizado[i].nombre,
          nombrecompleto: nombrecompleto,
          primer_apellido: data.data.usuarioPersonalizado[i].primer_apellido,
          segundo_apellido: data.data.usuarioPersonalizado[i].segundo_apellido,
          correo: data.data.usuarioPersonalizado[i].correo,
          curp: data.data.usuarioPersonalizado[i].curp,
          bloqueado: data.data.usuarioPersonalizado[i].bloqueado,
          estatus: data.data.usuarioPersonalizado[i].estatus,
          rol: data.data.usuarioPersonalizado[i].rol,
          created_at: data.data.usuarioPersonalizado[i].created_at
        }
      );
    }
  }

  verificardatos(){
    this.loading = true;
    this.mostrartabla = false;
    let objEnvio = {
      fecha_inicio: this.getFechaInicial.value,
      fecha_fin: this.getFechaFinal.value
    }
    if(this.getIdUsuario.value!=-1){
      objEnvio['id_usuario'] = this.getIdUsuario.value.id;
    }
    if(this.getIdTramite.value!=-1){
      objEnvio['id_tramite'] = this.getIdTramite.value;
    }
    if(this.getIdTipoPersona.value!=-1){
      objEnvio['tipo_persona'] = this.getIdTipoPersona.value;
    }

    if(this.getIdEstado.value!=-1){
        objEnvio['id_estado'] = this.getIdEstado.value;
    }

    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_REPORTE_CITAS,
      variables: objEnvio, fetchPolicy: 'no-cache'
       })
    .valueChanges.subscribe(result => {
        this.asignarDatosReporte(result);
     }, (error) => {

       var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error en la obtención de Citas.    </div></span>';
       M.toast({html: toastHTML});
      });


  }

  asignarDatosReporte(data){


    this.arrayCitas = [];
     for(var i = 0; i < data.data.reportesCitas.length;i++){
      let nombre = '';
      let tipo_persona = 'Fisica';
      if(data.data.reportesCitas[i].tipo_persona=='F'){
        nombre = data.data.reportesCitas[i].nombre + ' ' + data.data.reportesCitas[i].primer_apellido;
        if(data.data.reportesCitas[i].segundo_apellido!=undefined){
          nombre = nombre + ' ' + data.data.reportesCitas[i].segundo_apellido;
        }
      }
      if(data.data.reportesCitas[i].tipo_persona=='M'){
        tipo_persona = 'Moral';
        nombre =  data.data.reportesCitas[i].razon_social;

      }

      let nombretramite = '';
      if(data.data.reportesCitas[i].union_tramite_configuracion!=undefined){
        if(data.data.reportesCitas[i].union_tramite_configuracion.tramiteGeneral!=undefined){
          nombretramite = data.data.reportesCitas[i].union_tramite_configuracion.tramiteGeneral.nombre;
        }
      }
      let nombretramiteconfirmacion = '';
      if(data.data.reportesCitas[i].tramite_confirmacionGeneral!=undefined){
        if(data.data.reportesCitas[i].tramite_confirmacionGeneral!=undefined){
          nombretramiteconfirmacion = data.data.reportesCitas[i].tramite_confirmacionGeneral.nombre;
        }
      }
      let nombreatentido = null;
      if(data.data.reportesCitas[i].usuario!=undefined){
        nombreatentido = data.data.reportesCitas[i].usuario.nombre + ' ' + data.data.reportesCitas[i].usuario.primer_apellido;
        if(data.data.reportesCitas[i].usuario.segundo_apellido!=undefined){
          nombreatentido = nombreatentido + ' ' + data.data.reportesCitas[i].usuario.segundo_apellido;
        }
      }

      let documentacionfaltante = [];


      if(data.data.reportesCitas[i].documentacion!=null){
        const aux = data.data.reportesCitas[i].documentacion
        const array = Object.entries(aux);
         for(var x = 0; x < array.length;x++){
          documentacionfaltante.push(
            {
              nombre: array[x][0],
              valor: array[x][1]
            }
          );
        }
      }

      let comentario = data.data.reportesCitas[i].observacion;
      if (comentario == 'sin descripción') {
        comentario = '';
      }

      let estado_nombre = '';
      if(data.data.reportesCitas[i].estado.nombre.includes('OBSERVACIONES')){
        estado_nombre = 'CITA ATENDIDA '+ data.data.reportesCitas[i].estado.nombre;
      }else{
        estado_nombre = data.data.reportesCitas[i].estado.nombre;
      }
      this.arrayCitas.push(
        {
          id: data.data.reportesCitas[i].id,
          nombre: nombre,
          folio: data.data.reportesCitas[i].folio_general,
          hora: this.splithora(data.data.reportesCitas[i].hora),
          rfc: data.data.reportesCitas[i].rfc,
          fecha: this.funcioncrearfecha(data.data.reportesCitas[i].fecha),
          telefono: data.data.reportesCitas[i].telefono,
          tramite: nombretramite,
          tipo_persona: tipo_persona,
          usuario: nombreatentido,
          email: data.data.reportesCitas[i].email,
          numero_cita: data.data.reportesCitas[i].folio_dia,
          nombretramiteconfirmacion: nombretramiteconfirmacion,
          estado: estado_nombre,
          documentacion: data.data.reportesCitas[i].documentacion,
          observacion: comentario,
          documentacionfaltante: documentacionfaltante

        }
      );
    }



    this.mostrartabla = true;
    this.loading = false;

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

  descargarReporte(){
    let resultadotramite = null;
    let resultadousuario = null;
    let resultadotipo_persona = null;
    let resultadoestatus = null;
    let fecha_intervalo = ''
    let meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

    let diaActual = new Date();
       fecha_intervalo = diaActual.getDate()  + ' DE '+ meses[diaActual.getMonth()].toUpperCase() +' DEL ' + diaActual.getFullYear()

    if(this.user.rol.nombre.toUpperCase() == 'ENCARGADO'){
      if(this.getIdUsuario.value!=-1){
         resultadousuario = this.usuarios.find(usuario => parseInt(usuario.id) == parseInt(this.getIdUsuario.value.id));
      }
      if(this.getIdTramite.value!=-1){
        resultadotramite = this.tramites.find(tramite => parseInt(tramite.value) == parseInt(this.getIdTramite.value));
      }
      if(this.getIdTipoPersona.value!=-1){
        resultadotipo_persona = this.tipos_personas.find(tipo => String(tipo.value) == String(this.getIdTipoPersona.value));
      }
      if(this.getIdEstado.value!=-1){
        resultadoestatus = this.estados.find(estado => estado.id == this.getIdEstado.value);
      }
       fecha_intervalo = this.getFechaInicial.value + ' AL ' + this.getFechaFinal.value;

    }

    this.creadorReporteExcel.generarexcel(
      this.arrayCitas,
      resultadousuario,
      resultadotramite,
      resultadotipo_persona,
      resultadoestatus,
      fecha_intervalo

    );

  }

  verificarDia(){
    setTimeout(() => {
      if(this.getFechaFinal.value!=undefined){
        let date1 = new Date(this.getFechaInicial.value);
        date1.setDate(date1.getDate()+1);

        let date2 = new Date(this.getFechaFinal.value);
        date2.setDate(date2.getDate()+1);


        if (date1.getTime() > date2.getTime()){
          this.getFechaFinal.setValue(null);
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp; La fecha limite no debe ser menor a la fecha inicial.    </div></span>';
          M.toast({html: toastHTML});
        }
      }
    }, 100);


  }

  get getFechaInicial(): AbstractControl {
    return this.form.get('fecha_inicio');
  }

  get getFechaFinal(): AbstractControl {
    return this.form.get('fecha_fin');
  }

  get getIdUsuario(): AbstractControl {
    return this.form.get('id_usuario');
  }

  get getIdTramite(): AbstractControl {
    return this.form.get('id_tramite');
  }

  get getIdTipoPersona(): AbstractControl {
    return this.form.get('id_tipo_persona');
  }


  get getIdEstado(): AbstractControl {
    return this.form.get('id_estado');
  }


}
