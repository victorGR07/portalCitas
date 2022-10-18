import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import Swal from 'sweetalert2'
import { SessionStorageService } from '../core/services/sessionstorage.service';
declare var M: any;
import * as N from '../graphql/mutations';
import * as A from '../graphql/queries';
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  areaDiaEspecial: any;
  viewBtnValidar: boolean = false;
  mostrardatosPersona: boolean = false;
  btnViewDesbloquear: boolean = false;
  datosvalidadosdiaespecial: boolean = false;
  validadordiasespeciales: boolean = false;
  persona: any;
  areas: any;
  tramiteseleccionado: any;
  loading: boolean = false;
  disabledArea: boolean = false;
  mostrarmodal: boolean = false;
  objareaSeleccionada: any;
  minDate: any;
  moduloSeleccionado: any;
  modulosxDepa: any;
  arraydiasespeciales = new Array();
  esconderAreaTramite: boolean = true;
  mostrardespuesbusqueda: boolean = false;
  datosvalidos: boolean = false;
  mostrarresultadoshoracomida: boolean = false;
  mostraredittramite: boolean = false;
  booleanhorafinal: boolean = true;
  booleanhorafinaledicion: boolean = true;
  has_citas: boolean = true;
  objCita: any;
  tramites: any;
  modulos: any;
  objtramite: any;
  dias = [];
  diasedicion = [];
  tramitesaux = [];
  diasEspecialesSeleccionados = [];
  tramitesxDiaEspecial = [];
  fechastope = [];
  dias_configuracion = [];
  dias_configuracion_edicion = [];
  diaseleccionado: any;
  citaspermitidas: any;
  diaspermitidos: any;
  horasdos: any;
  horasdosedicion: any;
  horas: any;
  horasedicion: any;
  es: any;
  horainicio: any;
  horafinal: any;
  horafinaledicion: any;
  modulosSeleccionadosGeneral: any;
  moduloseleccionadodiaespecial: any;
  areaSeleccionadaEspecial: any;
  diasEspeciales: any;
  cols: any[];
  colstramites: any[];
  colsrequisitos: any[];
  colsrecomendaciones: any[];
  recomendaciones: any[];

  modulostotalesxreporte: any[];
  tramitexmoduloxtotales: any;
  tramitestotalesxreporte: any[];
  diastopes: any[];
  moduloxtramitextotales: any;
  arrayhorascomidas: any;
  date1: any;
  date2: Date;
  datetope: Date;
  mindatetope: any;
  horascomidas: any;
  inputhorascomida: any;
  duracionhoracomida: any;
  labelhorafinal: any;
  validaciondiatope: boolean = false;
  horacomidaseleccionada: any;
  objhoracomida1: any;
  inputhorasdoscomida: any;
  dateBloqueadoaux: any;
  dateBloqueado: any;
  user: any;
  tramiteseleccionadolabel: any;
  tramiteSeleccionadoEspecial: any;
  nombredeltramite: any;
  nombredeltramiteedicion: any;
  arrayrequisitos = new Array();
  arrayrequisitosedicion = new Array();
  verificarrutas: boolean = false;
  verificarrutasedicion: boolean = false;
  objhora1: any;
  objhora1edicion: any;
  booleanhorainicio: boolean = true;
  objhora2: any;
  objhora2edicion: any;
  cities2: any[];
  citiesedicion: any[];

  horainicial: any;
  horainicialedicion: any;
  tramiteseleccionadoedicion: any;
  uniontramite: any;
  duracion: any;

  duracion_edicion: any;
  enunciadodiastramite: any;


  booleanhorainicioedicion: boolean = true;
  mostrarselectedicionhorasdos: boolean = true;

  horainicioinfo: any;
  horafinalinfo: any;
  recomendacion: any;

  descripciondeltramite: any;
  descripciondeltramiteedicion: any;


  constructor(
    private apollo?: Apollo,
    private sessionStorageService?: SessionStorageService,
  ) { }

  ngOnInit() {
    this.enunciadodiastramite = '';
    this.horainicioinfo = '';
    this.horafinalinfo = '';
    this.traertramites();
    this.traerDias();
    this.traerFechasTope();
    this.traerRecomendaciones();
    this.user = JSON.parse(this.sessionStorageService.get('usuario'));
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["Enero ", "Febrero ", "Marzo ", "Abril ", "Mayo ", "Junio ", "Julio ", "Agosto ", "Septiembre ", "Octubre ", "Noviembre ", "Diciembre "],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }
    this.minDate = new Date();
    $(document).ready(function() {
      (<any>$(".tabs")).tabs();
    });
    $(document).ready(function() {
      (<any>$(".modal")).modal({ dismissible: false });
    });

    this.colsrecomendaciones = [
      { field: 'nombre', header: 'Nombre', style: 'width:75%' },
      { field: 'estatus', header: 'Estatus', style: 'width:10%' },
        ];

    this.cols = [
      { field: 'nombre', header: 'Nombre', style: 'width:65%' },
      { field: 'estado', header: 'Estado', style: 'width:10%' },
      { field: 'opciones', header: 'Opciones', style: 'width:15%' },
    ];

    this.colsrequisitos = [
      { field: 'descripcion', header: 'Descripción', style: 'width:30%' },
      { field: 'descripcion_larga', header: 'Descripción Extendida', style: 'width:40%' },
      { field: 'eliminar', header: 'Eliminar', style: 'width:10%' }

    ];
    this.traerhoras();
    this.cities2 = [
      { label: 'Lunes', value: { id: 1, name: 'Lunes', code: 'NY', nombre: "lunes", dia_codigo: 1, abreviatura: "lun" } },
      { label: 'Martes', value: { id: 2, name: 'Martes', code: 'RM', nombre: "martes", dia_codigo: 2, abreviatura: "mar" } },
      { label: 'Miercoles', value: { id: 3, name: 'Miercoles', code: 'LDN', nombre: "miercoles", dia_codigo: 3, abreviatura: "mie" } },
      { label: 'Jueves', value: { id: 4, name: 'Jueves', code: 'IST', nombre: "jueves", dia_codigo: 4, abreviatura: "jue" } },
      { label: 'Viernes', value: { id: 5, name: 'Viernes', code: 'PRS', nombre: "viernes", dia_codigo: 5, abreviatura: "vie" } },
      { label: 'Sabado', value: { id: 6, name: 'Sabado', code: 'PRS', nombre: "sabado", dia_codigo: 6, abreviatura: "sab" }},
      { label: 'Domingo', value: { id: 7, name: 'Domingo', code: 'PRS', nombre: "domingo", dia_codigo: 7, abreviatura: "dom" }},
    ];
  }


  traerRecomendaciones(){
    this.loading = true;
    this.recomendaciones = [];
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_RECOMENDACIONES_GENERAL,
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarRecomendaciones(result);
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error, favor de verificar su conexión a Internet.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  asignarRecomendaciones(data){
    for(var i = 0; i < data.data.recomendacionPersonalizadoGeneral.length;i++){
         this.recomendaciones.push(
          {
            id: data.data.recomendacionPersonalizadoGeneral[i].id,
            recomendacion: data.data.recomendacionPersonalizadoGeneral[i].recomendacion,
            estatus: data.data.recomendacionPersonalizadoGeneral[i].estatus
          }
        );


    }
    this.loading = false;

  }

  traerFechasTope() {
    this.loading = true;
    this.fechastope = [];
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_FECHAS,
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarFechasTope(result);
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error, favor de verificar su conexión a Internet.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  asignarFechasTope(data) {
    this.fechastope = data.data.fecha_configuraciones;
    if (data.data.fecha_configuraciones.length > 0) {
      this.mindatetope = data.data.fecha_configuraciones[0];
    }
    this.loading = false;

  }

  traerhoras() {
    this.horas = [
      { label: "9:00", value: 9 , labelcompleto: "9:00:00.000"},
      { label: "10:00", value: 10 , labelcompleto: "10:00:00.000"},
      { label: "11:00", value: 11 , labelcompleto: "11:00:00.000"},
      { label: "12:00", value: 12 , labelcompleto: "12:00:00.000"},
      { label: "13:00", value: 13 , labelcompleto: "13:00:00.000"},
      { label: "14:00", value: 14, labelcompleto: "14:00:00.000" },
      { label: "15:00", value: 15 , labelcompleto: "15:00:00.000"},
      { label: "16:00", value: 16 , labelcompleto: "16:00:00.000"},
      { label: "17:00", value: 17, labelcompleto: "17:00:00.000" },
      { label: "18:00", value: 18, labelcompleto: "18:00:00.000" }

    ]
    this.horasedicion = [
      { label: "9:00", value: 9 , labelcompleto: "9:00:00.000"},
      { label: "10:00", value: 10 , labelcompleto: "10:00:00.000"},
      { label: "11:00", value: 11 , labelcompleto: "11:00:00.000"},
      { label: "12:00", value: 12 , labelcompleto: "12:00:00.000"},
      { label: "13:00", value: 13, labelcompleto: "13:00:00.000" },
      { label: "14:00", value: 14, labelcompleto: "14:00:00.000" },
      { label: "15:00", value: 15, labelcompleto: "15:00:00.000" },
      { label: "16:00", value: 16 , labelcompleto: "16:00:00.000" },
      { label: "17:00", value: 17 , labelcompleto: "17:00:00.000"  },
      { label: "18:00", value: 18, labelcompleto: "18:00:00.000" }

    ]
  }

  pintardias() {
    var y = document.getElementsByClassName("ui-multiselect-item ui-corner-all ng-star-inserted");
    for (var i = 0; i < y.length; i++) {
      (<HTMLInputElement>y[i].children[1]).style.color = 'black';
      (<HTMLInputElement>y[i].children[1]).style.fontSize = '14px';
    }
  }

  cambioHora(event) {
       this.horasdos = [];
      for (let i = 0; i < this.horas.length; i++) {
        if (this.horainicial == this.horas[i].label) {
          this.objhora1 = this.horas[i];
        }
      }
      if(this.objhora1!=undefined){
        var arrayDeCadenas = this.objhora1.label.split(":");
        let duracion = this.duracion;
        let horainicio = new Date();
        horainicio.setHours(parseInt(arrayDeCadenas[0]));
        horainicio.setMinutes(0);
        horainicio.setSeconds(0);
        let horafinal = new Date();
        horafinal.setHours(18);
        horafinal.setMinutes(0);
        horafinal.setSeconds(0);
        let nuevashoras = horainicio;
        let i = 1;
        let horasfinales = [];
        while (nuevashoras.getTime() < horafinal.getTime()) {
          let fechanew = new Date();
          fechanew.setHours(horainicio.getHours());
          fechanew.setMinutes(0);
          fechanew.setSeconds(0);
          fechanew.setMinutes(horainicio.getMinutes() + (i * duracion));
          nuevashoras = fechanew;
          let minutos = "";
          if (fechanew.getMinutes() < 10) {
            minutos = "0" + fechanew.getMinutes();
          } else {
            minutos = "" + fechanew.getMinutes();
          }
          if (nuevashoras.getTime() < horafinal.getTime()) {
            this.horasdos.push(
              { label: fechanew.getHours() + ":" + minutos, value: fechanew.getHours() + ":" + minutos , labelcompleto: fechanew.getHours() + ":" + minutos + ":00.000" }
            );
          }
          i++;
        }
        this.booleanhorafinal = false;
      }


  }



  cambioHoraEdicion() {
    this.horasdosedicion = [];
    if(this.horainicialedicion!=undefined){
      for (let i = 0; i < this.horasedicion.length; i++) {
        if (this.horainicialedicion == this.horasedicion[i].label) {
          this.objhora1edicion = this.horasedicion[i];
        }
      }
      var arrayDeCadenas = this.objhora1edicion.label.split(":");
      let duracion = this.duracion_edicion;
      let horainicio = new Date();
      horainicio.setHours(parseInt(arrayDeCadenas[0]));
      horainicio.setMinutes(0);
      horainicio.setSeconds(0);
      let horafinal = new Date();
      horafinal.setHours(18);
      horafinal.setMinutes(0);
      horafinal.setSeconds(0);
      let nuevashoras = horainicio;
      let i = 1;
      let horasfinales = [];
      while (nuevashoras.getTime() < horafinal.getTime()) {
        let fechanew = new Date();
        fechanew.setHours(horainicio.getHours());
        fechanew.setMinutes(0);
        fechanew.setSeconds(0);
        fechanew.setMinutes(horainicio.getMinutes() + (i * duracion));
        nuevashoras = fechanew;
        let minutos = "";
        if (fechanew.getMinutes() < 10) {
          minutos = "0" + fechanew.getMinutes();
        } else {
          minutos = "" + fechanew.getMinutes();
        }
         if (nuevashoras.getTime() < horafinal.getTime()) {
          this.horasdosedicion.push(
            { label: fechanew.getHours() + ":" + minutos, value: fechanew.getHours() + ":" + minutos , labelcompleto: fechanew.getHours() + ":" + minutos + ":00.000"  }
          );
        }
        i++;
      }


      this.horafinaledicion = null;
      this.booleanhorafinaledicion = false;
      this.mostrarselectedicionhorasdos = true;
    }

  }

  traertramites() {
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_TRAMITES_GENERAL, fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarTramites(result);
      });
  }

  asignarTramites(data) {
    this.tramites = [];
    for (var i = 0; i < data.data.tramitesGeneral.length; i++) {
      this.tramites.push(
        {
          value: data.data.tramitesGeneral[i].id,
          label: data.data.tramitesGeneral[i].nombre,
          descripcion: data.data.tramitesGeneral[i].descripcion,
          estatus: data.data.tramitesGeneral[i].estatus,
          requisitos: data.data.tramitesGeneral[i].requisitos
        }
      )
    }
  }

  traerDias() {
    this.loading = true;
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_DIAS_BLOQ,
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarDias(result);
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error, favor de verificar su conexión a Internet.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  asignarDias(data: any) {
    this.dias = data.data.dias;
    let arreglodias = [];
    this.loading = true;
    for (var i = 0; i < this.dias.length; i++) {
      let diahora = this.dias[i].fecha;
      var str = diahora;
      var res = str.split("-");
      let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      let indice = parseInt(res[0]);
      let horacita = res[1] + "-" + meses[indice - 1];
    }
    this.loading = false;
  }

  formatoDiaFecha(fecha: any) {
    let diahora = fecha;
    var str = diahora;
    var res = str.split("-");
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let indice = parseInt(res[1]);
    let horacita = res[0] + "-" + meses[indice - 1];
    return horacita;
  }

  validador() {
    this.createDiaNoDisponibles();
  }

  createDiaNoDisponibles() {
    let dia = this.dateBloqueado.getDate().toString();
    let anio = this.dateBloqueado.getFullYear().toString();
    let mes = "";
    if ((this.dateBloqueado.getMonth() + 1) < 10) {
      mes = "0" + (this.dateBloqueado.getMonth() + 1).toString();
    } else {
      mes = (this.dateBloqueado.getMonth() + 1).toString();
    }
    if ((this.dateBloqueado.getDate() + 1) <= 10) {
      dia = "0" + (this.dateBloqueado.getDate()).toString();
    } else {
      dia = (this.dateBloqueado.getDate()).toString();
    }
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let vigencia = dia + "-" + mes + "-" + anio + "";
    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.NEW_DATE,
        variables: {
          fecha: vigencia,
          id_usuario: this.user.id
        }
      }).subscribe(result => {

        $(document).ready(function() {
          (<any>$("#modalcreateDay")).modal('close');
          (<any>$(".modal")).modal('close');
        });
        this.limpiador();
        this.traerDias();
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Fecha creada con exito</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      }, (error) => {

        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al crear el día bloqueado</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  limpiador() {
    this.dateBloqueado = null;
    this.dateBloqueadoaux = null;
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  cambioDia(event) {
    if (!this.isEmpty(this.dateBloqueadoaux)) {
      let variable = false;
      var res = this.dateBloqueadoaux.split("-");
      this.dateBloqueado = new Date(parseInt(res[0]), parseInt(res[1]) - 1, parseInt(res[2]));
      for (var o = 0; o < this.dias.length; o++) {
        var resaux = this.dias[o].fecha.split("-");
        let diaauxbloqueo = new Date(parseInt(resaux[2]), parseInt(resaux[1]) - 1, parseInt(resaux[0]));
        if (this.dateBloqueado.getDate() == diaauxbloqueo.getDate() && this.dateBloqueado.getMonth() == diaauxbloqueo.getMonth()) {
          variable = true;
        }
      }
      if (variable == true) {
        this.dateBloqueado = null;
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Día ya registrado.</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      }
    } else {
      this.dateBloqueado = null;
    }
  }

  cambioDiaEvent(event) {
    this.validarDias();
  }

  traerDiasEspeciales() {
    this.loading = true;
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_DAYS_SPECIAL,
      variables: {
        id_tramite: this.tramiteSeleccionadoEspecial
      },
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarDiasEspeciales(result);
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error, favor de verificar su conexión a Internet.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  asignarDiasEspeciales(data) {
    this.diasEspeciales = [];
    for (var i = 0; i < data.data.diasEspecialesByTramite.length; i++) {
      let dias_especiales;
      if (data.data.diasEspecialesByTramite[i].dias_especiales == null) {
        dias_especiales = [];
      } else {
        dias_especiales = data.data.diasEspecialesByTramite[i].dias_especiales
      }
      this.diasEspeciales.push(
        {
          id: data.data.diasEspecialesByTramite[i].id,
          nombre: data.data.diasEspecialesByTramite[i].nombre,
          dias_especiales: dias_especiales,
          tramites: data.data.diasEspecialesByTramite[i].tramites
        }
      );
    }
    this.loading = false;

  }

  asignarTramitesxTramite(diaespecial) {
    this.tramitesxDiaEspecial = diaespecial.tramites;
  }

  verificardias() {
    let diasespeciales = [];
    this.validadordiasespeciales = false;
    for (var i = 0; i < this.diasEspeciales.length; i++) {
      diasespeciales = [];
      for (var x = 0; x < this.diasEspeciales[i].diasEspecialesSeleccionados.length; x++) {
        diasespeciales.push(this.diasEspeciales[i].diasEspecialesSeleccionados[x].fecha);
      }
      if (diasespeciales.length > 0) {
        this.validadordiasespeciales = true;
      }
    }
  }

  eliminarDiasEspeciales() {
    let diasespeciales = [];

    for (var i = 0; i < this.diasEspeciales.length; i++) {
      diasespeciales = [];
      for (var x = 0; x < this.diasEspeciales[i].diasEspecialesSeleccionados.length; x++) {
        diasespeciales.push(this.diasEspeciales[i].diasEspecialesSeleccionados[x].fecha);
      }
      if (diasespeciales.length > 0) {

        this.apollo.use('backproveedores')
          .mutate({
            mutation: N.DELETE_DAYS_SPECIAL,
            variables: {
              id_tramite: this.tramiteSeleccionadoEspecial,
              id_usuario: this.user.id,
              dias: diasespeciales
            }
          }).subscribe(result => {
            this.validadordiasespeciales = false;
            this.traerDiasEspeciales();
          }, (error) => {
          });
      }
    }
  }

  guardardiaespecial() {
    let objenviar = new Object();
    let arrayDiasSpecial = [];
    for (var i = 0; i < this.arraydiasespeciales.length; i++) {
      let horacompletafinal;
      let horacompletainicio;
      var res = this.arraydiasespeciales[i].dia.split("-");
      let newDate = new Date(parseInt(res[0]), parseInt(res[1]) - 1, parseInt(res[2]));
      let diaDE = newDate.getDate().toString();
      let anioDE = newDate.getFullYear().toString();
      let mesDE = "";
      if ((newDate.getMonth() + 1) < 10) {
        mesDE = "0" + (newDate.getMonth() + 1).toString();
      } else {
        mesDE = (newDate.getMonth() + 1).toString();
      }
      if ((newDate.getDate() + 1) <= 10) {
        diaDE = "0" + (newDate.getDate()).toString();
      } else {
        diaDE = (newDate.getDate()).toString();
      }
      let diaenunciadoDE = anioDE + "/" + mesDE + "/" + diaDE;
      arrayDiasSpecial.push(
        {
          fecha: diaenunciadoDE
        }
      );
    }
    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.CREATE_DAY_SPECIAL,
        variables: {
          id_tramite: this.tramiteSeleccionadoEspecial,
          id_usuario: this.user.id,
          dias: arrayDiasSpecial
        }
      }).subscribe(result => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Dia Especial Agregado.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
        $(document).ready(function() {
          (<any>$(".modal")).modal('close');
          (<any>$(".modal")).modal('close');

        });
        this.arraydiasespeciales = [];
        this.datosvalidadosdiaespecial = false;
        this.traerDiasEspeciales();
      }, (error) => {
      });
  }

  salirdiaespecial() {
    this.tramiteseleccionado = null;
    this.arraydiasespeciales = [];
    this.datosvalidadosdiaespecial = false;
    this.modulosSeleccionadosGeneral = null;
    $(document).ready(function() {
      (<any>$("#modalcreateDay")).modal('close');
      (<any>$(".modal")).modal('close');

    });
  }

  asignarTramite() {
    const resultado = this.tramites.find(tramite => tramite.value == String(this.tramiteSeleccionadoEspecial));
    this.tramiteseleccionadolabel = resultado;
  }

  reiniciar() {
    this.arraydiasespeciales = [];
    this.datosvalidadosdiaespecial = false;

  }

  addDiaEspecial() {
    let diaespecial ={dia: null};
    this.arraydiasespeciales.push(diaespecial);
    this.validarDias();
  }

  validarDias() {
    let validador = true;
    if (this.arraydiasespeciales.length == 0) {
      validador = false;
    }
    for (var i = 0; i < this.arraydiasespeciales.length; i++) {
      if (this.arraydiasespeciales[i].dia == null) {
        validador = false;
      }
    }
    this.datosvalidadosdiaespecial = validador;
  }

  guardartramite() {
  }

  validadorEdicionTramite() {
    let validacion = false;
    let mensajes = [];
    if (this.nombredeltramiteedicion != undefined && this.nombredeltramiteedicion.nombre != '' && validacion == false) {
      validacion = true;
    }
    if (this.nombredeltramiteedicion == undefined || this.nombredeltramiteedicion == '') {
      mensajes.push("Favor de completar los datos del Formulario del nuevo Trámite");
      validacion = false;
    }
    if (validacion == true) {
      this.loading = true;
      this.guardarediciontramite();
    } else {
      let mensaje = '';
      for (var i = 0; i < mensajes.length; i++) {
        mensaje = mensaje + "<br> * " + mensajes[i];
      }
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;' + mensaje + '</div></span>';
      M.toast({ html: toastHTML , displayLength:40000});
    }
  }

  guardarediciontramite() {

    let json_tramite = {
      id: this.tramiteseleccionadoedicion.value,
      nombre: this.nombredeltramiteedicion,
      id_usuario: this.user.id
    }
    let descripcion_tramite = null;
    if(this.descripciondeltramiteedicion!=undefined && (this.descripciondeltramiteedicion!=undefined && this.descripciondeltramiteedicion.length>0)){
      json_tramite['descripcion'] = this.descripciondeltramiteedicion;
    }

    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.ACTUALIZAR_TRAMITE,
        variables: json_tramite
      }).subscribe(result => {
        this.actualizarrequisitostramites();

      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al intentar actualizar el tramite</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  actualizarrequisitostramites(){
    let requisitos = [];
    for (var i = 0; i < this.arrayrequisitosedicion.length; i++) {

      requisitos.push(
        {
          nombre_corto: this.arrayrequisitosedicion[i].descripcion,
          nombre_largo: this.arrayrequisitosedicion[i].descripcion_larga,
          ordenamiento: (i+1)
        }
      );
    }

    let objrequisitos = {
      requisitos: requisitos
    }



    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.ACTUALIZAR_REQUISITOS_TRAMITE,
        variables: {
          id: this.tramiteseleccionadoedicion.value,
          requisitos: requisitos,
          id_usuario: this.user.id
        }
      }).subscribe(result => {
        $(document).ready(function() {
          (<any>$("#modaledicionTramite")).modal('close');
          (<any>$(".modal")).modal('close');

        });
        this.loading = false;

        this.traertramites();
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Trámite actualizado con exito</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});

      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al intentar actualizar el tramite</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });



  }

  validadorCreacionTramite() {

    let validacion = false;
    let mensajes = [];
    if (this.nombredeltramite != undefined && this.nombredeltramite.nombre != '' && validacion == false) {
      validacion = true;
    }

    if (validacion == true) {
      this.crearnewtramite();
    } else {
      let mensaje = '';
      for (var i = 0; i < mensajes.length; i++) {
        mensaje = mensaje + "<br> * " + mensajes[i];
      }
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;' + mensaje + '</div></span>';
      M.toast({ html: toastHTML , displayLength:40000});
    }
  }

  crearnewtramite() {
    if(this.tramites.length>0){

      this.apollo.use('backproveedores').watchQuery({
        query: A.UNION_TRAMITE,
        variables: {
          id_tramite: this.tramites[0].value
        },
        fetchPolicy: 'no-cache'
      })
        .valueChanges.subscribe(result => {
          this.asignarUnionTramiteparaNuevoTramite(result);
        });


    }else{
      this.mandarcreaciontramite({});

    }
    
  }

  asignarUnionTramiteparaNuevoTramite(data){
    let jsondias = { "dias": data.data.unionByTramite[0].configuracion.dias, "tiempo_cita": data.data.unionByTramite[0].configuracion.tiempo_cita };
    this.mandarcreaciontramite(jsondias);
  }


  mandarcreaciontramite(json: any) {
    this.loading = true;
    let requisitos = [];
    for (var i = 0; i < this.arrayrequisitos.length; i++) {
      requisitos.push(
        {
          nombre_corto: this.arrayrequisitos[i].descripcion,
          nombre_largo: this.arrayrequisitos[i].descripcion_larga,
          ordenamiento: (i+1)
        }
      );
    }
    let json_tramite = {
      nombre: this.nombredeltramite.trim(),
      requisitos: requisitos,
      id_usuario: this.user.id
    }
    let descripcion_tramite = null;
    if(this.descripciondeltramite!=undefined && (this.descripciondeltramite!=undefined && this.descripciondeltramite.length>0)){
      json_tramite['descripcion'] = this.descripciondeltramite;
    }
    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.CREATE_TRAMITE,
        variables: json_tramite
      }).subscribe(result => {
        this.relacionarentidades(result, json);
      }, (error) => {
        $(document).ready(function() {
          (<any>$(".modal")).modal('close');
        });
        this.loading = false;

                  var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;' + error.message +'.</div></span>';
                  M.toast({ html: toastHTML , displayLength:40000});

      });
  }

  inicializarDias(){

    this.nombredeltramite = null;
    this.arrayrequisitos = [];
    setTimeout(() => {

    $(document).ready(function() {
      (<any>$(".modal")).modal('close');
    });

    this.revisiontramiteconfiguracion();

  }, 100);



  }

  revisiontramiteconfiguracion(){
    setTimeout(() => {
      if(this.tramites!=undefined){
        if(this.tramites.length==0){
          $(document).ready(function() {
            (<any>$("#modalcreateTramite")).modal('open');
          });

          this.validarrequisito();
          $(document).ready(function() {
            (<any>$("#dias_configuracion")).formSelect();
          });
        }else{
          this.apollo.use('backproveedores').watchQuery({
            query: A.UNION_TRAMITE,
            variables: {
              id_tramite: this.tramites[0].value
            },
            fetchPolicy: 'no-cache'
          })
            .valueChanges.subscribe(result => {
              this.verificarUnionTramiteCrearTramite(result);
            });

        }

      }
    }, 100);
  }

  verificarUnionTramiteCrearTramite(data){
    if(data.data.unionByTramite.length>0){
      if(Object.entries(data.data.unionByTramite[0].configuracion).length == 0){
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp No tiene configuracion, favor de agregarla</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      }else{

        setTimeout(() => {

        $(document).ready(function() {
          (<any>$(".modal")).modal('close');

          (<any>$("#modaledicionConfiguracionTramiteGrobal")).modal('close');
        });

      }, 100);

      setTimeout(() => {

        $(document).ready(function() {
          (<any>$("#modalcreateTramite")).modal('open');
        });

        this.validarrequisito();
        $(document).ready(function() {
          (<any>$("#dias_configuracion")).formSelect();
        });

    }, 200);

      }

    }
  }

  relacionarentidades(data: any, json: any) {
    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.CREATE_UNION,
        variables: {
          id_tramite: data.data.tramite.id,
          configuracion: json,
          id_usuario: this.user.id
        }
      }).subscribe(result => {
        if(this.tramites.length==0){
          this.cambiarainactivotramitecreado(data.data.tramite.id);

        }else{
          this.loading = false;

          $(document).ready(function() {
            (<any>$("#modalcreateTramite")).modal('close');
            (<any>$(".modal")).modal('close');

          });
          this.traertramites();
          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Trámite agregado con exito</div></span>';
          M.toast({ html: toastHTML , displayLength:40000});
        }

      }, (error) => {
        this.loading = false;

        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al crear el Trámite</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  cambiarainactivotramitecreado(id){
    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.CAMBIAR_ESTADO_TRAMITE,
        variables: {
          id: id,
          estatus: false,
          id_usuario: this.user.id
        }
      }).subscribe(result => {
        this.loading = false;

        $(document).ready(function() {
          (<any>$("#modalcreateTramite")).modal('close');
          (<any>$(".modal")).modal('close');

        });
        this.traertramites();
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Trámite agregado con exito</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
       }, (error) => {
         this.loading = false;

        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al tratar del cambiar el estado del trámite</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  salirtramite() {
  }

  addRequisito() {


    let validacion = true;

    if (this.arrayrequisitos.length == 0) {
      validacion = true;
    }

     for (var i = 0; i < this.arrayrequisitos.length; i++) {
      if (this.arrayrequisitos[i].descripcion.trim() == "") {
        validacion = false;
      }
    }

    if(validacion){
      let requisito = {descripcion: "",descripcion_larga: ""};
      this.arrayrequisitos.push(requisito);
      this.validarrequisito();
    }else{
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;No puede agregar mas requisitos si no ha completado los anteriores.    </div></span>';
      M.toast({ html: toastHTML , displayLength:40000});


    }


  }

  validarrequisito() {
    if (this.arrayrequisitos.length == 0) {
      this.verificarrutas = true;
    }
    let validacion = true;
    for (var i = 0; i < this.arrayrequisitos.length; i++) {
      if (this.arrayrequisitos[i].descripcion.trim() == "") {
        validacion = false;
      }
    }

    this.verificarrutas = validacion;
   }


  addRequisitoedicion() {

    let validacion = true;

    if (this.arrayrequisitosedicion.length == 0) {
      validacion = true;
    }

     for (var i = 0; i < this.arrayrequisitosedicion.length; i++) {
      if (this.arrayrequisitosedicion[i].descripcion.trim() == "") {
        validacion = false;
      }
    }

    if(validacion){
      let requisito = {descripcion: "",descripcion_larga: ""};
      this.arrayrequisitosedicion.push(requisito);
      this.validarrequisitoedicion();
    }else{
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;No puede agregar mas requisitos si no ha completado los anteriores.    </div></span>';
      M.toast({ html: toastHTML , displayLength:40000});


    }



  }

  validarrequisitoedicion() {
    if (this.arrayrequisitosedicion.length == 0) {
      this.verificarrutasedicion = false;
    } else {
      this.verificarrutasedicion = true;
    }
    for (var i = 0; i < this.arrayrequisitosedicion.length; i++) {
      if (this.arrayrequisitosedicion[i].descripcion == "") {
        this.verificarrutasedicion = false;
      }
    }
  }

  deleterequisito(numero: any) {

    this.arrayrequisitos.splice(numero, 1);
    this.validarrequisito();
  }

  deleterequisitoedicion(numero: any) {
    this.arrayrequisitosedicion.splice(numero, 1);
    this.validarrequisitoedicion();
  }

  cambioHorados(event) {
    for (let i = 0; i < this.horasdos.length; i++) {
      if (this.horafinal == this.horasdos[i].label) {
        this.objhora2 = this.horasdos[i];
      }
    }
  }


  cambioHoradosEdicion(event) {
    for (let i = 0; i < this.horasdosedicion.length; i++) {
      if (this.horafinaledicion == this.horasdosedicion[i].label) {
        this.objhora2edicion = this.horasdosedicion[i];
      }
    }
  }

  calculardiatope() {
    if (this.mindatetope != undefined) {
      let datecompare = new Date(this.datetope);
      let datecompare2 = new Date(this.mindatetope.fecha);
      if (datecompare.getTime() < datecompare2.getTime()) {
        this.validaciondiatope = false;
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Fecha no disponible, es menor al ultimo tope creado.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      } else {
        this.validaciondiatope = true;
      }
    } else {
      this.validaciondiatope = true;
    }
  }

  agregarDiaTope() {
    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.CREATE_TOPE,
        variables: {
          fecha_configuracion: this.datetope,
          id_usuario: this.user.id
        }
      }).subscribe(result => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Nueva Fecha Agregada.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
        this.traerFechasTope();
        this.limpiarmodaltope();
        this.validaciondiatope = false;
        (<any>$(".modal")).modal('close');

      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error al intentar crear la nueva fecha.    </div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  limpiarmodaltope() {
    this.validaciondiatope = false;
    this.datetope = null;
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

  eliminardialimite(limite) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success btnok',
        cancelButton: 'btn btn-danger btncancel'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      text: '¿Esta seguro de eliminar el día seleccionado?',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apollo.use('backproveedores')
          .mutate({
            mutation: N.QUITAR_TOPE,
            variables: {
              id: limite.id,
              id_usuario: this.user.id
            }
          }).subscribe(result => {
            var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Día Eliminado.    </div></span>';
            M.toast({ html: toastHTML , displayLength:40000});
            this.traerFechasTope();
            this.limpiarmodaltope();
            (<any>$(".modal")).modal('close');
            this.validaciondiatope = false;
          }, (error) => {
            var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al tratar del eliminar el día</div></span>';
            M.toast({ html: toastHTML , displayLength:40000});
          });
      }
    })
  }

  abrirEditarTramite(tramite) {
    this.tramiteseleccionadoedicion = tramite;
    this.nombredeltramiteedicion = this.tramiteseleccionadoedicion.label;
    this.descripciondeltramiteedicion =this.tramiteseleccionadoedicion.descripcion;
    this.arrayrequisitosedicion = [];
    if(this.tramiteseleccionadoedicion.requisitos.requisitos!=undefined){
      for (var i = 0; i < this.tramiteseleccionadoedicion.requisitos.requisitos.length; i++) {
        this.arrayrequisitosedicion.push(
          {
            descripcion: this.tramiteseleccionadoedicion.requisitos.requisitos[i].nombre_corto,
            descripcion_larga: this.tramiteseleccionadoedicion.requisitos.requisitos[i].nombre_largo
          }
        );
      }
    }else{
      for (var i = 0; i < this.tramiteseleccionadoedicion.requisitos.length; i++) {
        this.arrayrequisitosedicion.push(
          {
            descripcion: this.tramiteseleccionadoedicion.requisitos[i].nombre_corto,
            descripcion_larga: this.tramiteseleccionadoedicion.requisitos[i].nombre_largo
          }
        );
      }
    }

    this.validarrequisito();
    setTimeout(() => {
      $(document).ready(function() {
        (<any>$("#modaledicionTramite")).modal('open');
      });
    }, 100);
   }

  obtenerUnion() {
    this.apollo.use('backproveedores').watchQuery({
      query: A.UNION_TRAMITE,
      variables: {
        id_tramite: this.tramiteseleccionadoedicion.value
      },
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarUnionTramite(result);
      });
  }

  asignarUnionTramite(data) {
    this.uniontramite = data.data.unionByTramite[0];
    this.dias_configuracion_edicion = [];
    for (var y = 0; y < this.uniontramite.configuracion.dias.length; y++) {
      if (this.uniontramite.configuracion.dias[y].permitido) {
        this.dias_configuracion_edicion.push(this.cities2[y].value);
      }
    }
    let arrayhorainicial = this.uniontramite.configuracion.dias[0].inicio.split(":")
    const resultado = this.horasedicion.find(hora => hora.value == parseInt(arrayhorainicial[0]));
    this.horainicialedicion = resultado.label;
    let duracion = this.uniontramite.configuracion.tiempo_cita;
    this.horasdosedicion = [];
    let horainicio = new Date();
    horainicio.setHours(parseInt(arrayhorainicial[0]));
    horainicio.setMinutes(0);
    horainicio.setSeconds(0);
    let horafinal = new Date();
    horafinal.setHours(18);
    horafinal.setMinutes(0);
    horafinal.setSeconds(0);
    let nuevashoras = horainicio;
    let i = 1;
    let horasfinales = [];
    while (nuevashoras.getTime() < horafinal.getTime()) {
      let fechanew = new Date();
      fechanew.setHours(horainicio.getHours());
      fechanew.setMinutes(0);
      fechanew.setSeconds(0);
      fechanew.setMinutes(horainicio.getMinutes() + (i * duracion));
      nuevashoras = fechanew;
      let minutos = "";
      if (fechanew.getMinutes() < 10) {
        minutos = "0" + fechanew.getMinutes();
      } else {
        minutos = "" + fechanew.getMinutes();
      }
      if (nuevashoras.getTime() < horafinal.getTime()) {
        this.horasdosedicion.push(
          { label: fechanew.getHours() + ":" + minutos, value: fechanew.getHours() + ":" + minutos + ":00.000", labelcompleto: fechanew.getHours() + ":" + minutos + ":00.000" }
        );
      }
      i++;
    }


    this.validarrequisito();
    setTimeout(() => {
      $(document).ready(function() {
        (<any>$("#modaledicionTramite")).modal('open');
      });
    }, 100);
  }

  abrirconfirmacioncambio(tramite){

    $(document).ready(function() {
      (<any>$("#modalcreateTramite")).modal('close');
      (<any>$(".modal")).modal('close');

    });

    setTimeout(() => {
      this.apollo.use('backproveedores').watchQuery({
        query: A.UNION_TRAMITE,
        variables: {
          id_tramite: tramite.value
        },
        fetchPolicy: 'no-cache'
      })
        .valueChanges.subscribe(result => {
          this.verificarUnionTramite(result,tramite);
        });
    }, 100);
  }

  verificarUnionTramite(data,tramite){
    if(Object.entries(data.data.unionByTramite[0].configuracion).length == 0){
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp No tiene configuracion</div></span>';
      M.toast({ html: toastHTML , displayLength:40000});
    }else{
      let letrero= '¿Desea activar el trámite ' + tramite.label + '?';
      let letrero2= 'Activar';

      if(tramite.estatus){
        letrero = '¿Desea desactivar el trámite ' + tramite.label + '?';
        letrero2= 'Desactivar';
      }
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btnok',
          cancelButton: 'btn btn-danger btncancel'
        },
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        text: letrero,
        confirmButtonText: letrero2,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.apollo.use('backproveedores')
            .mutate({
              mutation: N.CAMBIAR_ESTADO_TRAMITE,
              variables: {
                id: tramite.value,
                estatus: !tramite.estatus,
                id_usuario: this.user.id
              }
            }).subscribe(result => {
              var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Cambio realizado correctamente.    </div></span>';
              M.toast({ html: toastHTML , displayLength:40000});
              this.traertramites();
             }, (error) => {
              var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al tratar del cambiar el estado del trámite</div></span>';
              M.toast({ html: toastHTML , displayLength:40000});
            });
        }
      })
    }


  }

  abrirInfoTramite(tramitea){
    const resultado = this.tramites.find(tramite => tramite.value == String(tramitea.value));
    this.tramiteseleccionadolabel = resultado;
    this.apollo.use('backproveedores').watchQuery({
      query: A.UNION_TRAMITE,
      variables: {
        id_tramite: this.tramiteseleccionadolabel.value
      },
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarUnionTramiteInfo(result);
      });


  }


  splithora(stringdate: any){
    let diahora = stringdate;
    var str = diahora;
    var res = str.split(":");
    let horacita = res[0] + ":" + res[1];
    return  horacita ;
  }

  asignarUnionTramiteInfo(data) {
    this.uniontramite = data.data.unionByTramite[0];

    this.enunciadodiastramite = '';
    let dias_permitidos = [];

    for(var i = 0; i < this.uniontramite.configuracion.dias.length;i++){
      if(this.uniontramite.configuracion.dias[i].permitido){
        dias_permitidos.push(this.uniontramite.configuracion.dias[i]);
      }
    }


    for(var i = 0; i < dias_permitidos.length;i++){
      if(i == 0){
        this.enunciadodiastramite = this.enunciadodiastramite +  dias_permitidos[i].nombre.toUpperCase()
      }else{
        if(i == dias_permitidos.length-1){
          this.enunciadodiastramite = this.enunciadodiastramite + ' y ' + dias_permitidos[i].nombre.toUpperCase()

        }else{
          this.enunciadodiastramite = this.enunciadodiastramite + ', ' + dias_permitidos[i].nombre.toUpperCase()

        }
       }

    }

    this.horainicioinfo = this.splithora(this.uniontramite.configuracion.dias[0].inicio)
    this.horafinalinfo = this.splithora(this.uniontramite.configuracion.dias[0].fin)

    $(document).ready(function() {
      (<any>$("#modalinfoTramite")).modal('open');

    });

  }


  limpiardiasespeciales(){
    this.tramiteSeleccionadoEspecial = null;
    this.diasEspeciales = null;
  }

  limpiarnuevotramite(){

    $(document).ready(function() {
      (<any>$(".modal")).modal('close');
    });
    this.nombredeltramite = null;
    this.arrayrequisitos = [];
    this.dias_configuracion = [];
    this.horainicial = null;
    this.horafinal = null;
    this.duracion = null;
    this.recomendacion = null;
  }

  validarduracion(){
    if(typeof this.duracion === 'number'){
      if(this.duracion>0){
       this.booleanhorainicio = false;
       setTimeout(() => {
         this.cambioHora(false);

       }, 100);

     }
     this.booleanhorafinal = true;
     this.horasdos = null;
    }else{
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Favor de escribir un número correcto</div></span>';
     M.toast({html: toastHTML, displayLength:40000});
    }

  }


  validarduracionEdicion(){
    if(typeof this.duracion_edicion === 'number'){
      if(this.duracion_edicion>0){
       this.booleanhorainicioedicion = false;
       this.mostrarselectedicionhorasdos = false;

       setTimeout(() => {
         this.cambioHoraEdicion();

       }, 100);

     }
     this.booleanhorafinaledicion = true;
     this.horasdosedicion = null;
    }else{
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Favor de escribir un número correcto</div></span>';
     M.toast({html: toastHTML, displayLength:40000});
    }

  }



  abrirEdicionConfiguracionTramite(tramitea){
      this.tramiteseleccionadoedicion = tramitea;
    const resultado = this.tramites.find(tramite => tramite.value == String(tramitea.value));
    this.tramiteseleccionadolabel = resultado;
    this.apollo.use('backproveedores').watchQuery({
      query: A.UNION_TRAMITE,
      variables: {
        id_tramite: this.tramiteseleccionadolabel.value
      },
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarUnionTramiteEdicion(result);
      });

  }


  asignarUnionTramiteEdicion(data) {
    this.horafinaledicion = null;
    this.uniontramite = data.data.unionByTramite[0];
    this.citiesedicion = [];
    this.dias_configuracion_edicion = [];

    for(var x = 0; x < this.uniontramite.configuracion.dias.length;x++){
      if(this.uniontramite.configuracion.dias[x].permitido){
        this.citiesedicion.push(this.cities2[x]);
        this.dias_configuracion_edicion.push(this.cities2[x].value);
      }

    }

    let arrayhorainicial = this.uniontramite.configuracion.dias[0].inicio.split(":")
    const resultado = this.horasedicion.find(hora => hora.value == parseInt(arrayhorainicial[0]));
    this.horainicialedicion = resultado.label;
    let duracion = this.uniontramite.configuracion.tiempo_cita;
    this.horasdosedicion = [];
    let horainicio = new Date();
    horainicio.setHours(parseInt(arrayhorainicial[0]));
    horainicio.setMinutes(0);
    horainicio.setSeconds(0);
    let horafinal = new Date();
    horafinal.setHours(18);
    horafinal.setMinutes(0);
    horafinal.setSeconds(0);
    let nuevashoras = horainicio;
    let i = 1;
    let horasfinales = [];
    while (nuevashoras.getTime() < horafinal.getTime()) {
      let fechanew = new Date();
      fechanew.setHours(horainicio.getHours());
      fechanew.setMinutes(0);
      fechanew.setSeconds(0);
      fechanew.setMinutes(horainicio.getMinutes() + (i * duracion));
      nuevashoras = fechanew;
      let minutos = "";
      if (fechanew.getMinutes() < 10) {
        minutos = "0" + fechanew.getMinutes();
      } else {
        minutos = "" + fechanew.getMinutes();
      }
      if (nuevashoras.getTime() < horafinal.getTime()) {
        this.horasdosedicion.push(
          { label: fechanew.getHours() + ":" + minutos, value: fechanew.getHours() + ":" + minutos, labelcompleto: fechanew.getHours() + ":" + minutos + ":00.000" }
        );
      }
      i++;
    }
    let arrayhorafinal = this.uniontramite.configuracion.dias[0].fin.split(":")

    let conjuntofinhora = arrayhorafinal[0] + ':' + arrayhorafinal[1];
    const resultadofinal = this.horasdosedicion.find(hora => hora.label == conjuntofinhora);

    if(resultadofinal!=undefined){
      setTimeout(() => {
        this.horafinaledicion = resultadofinal.label;
        this.objhora2edicion = resultadofinal;
      }, 100);

    }


    this.duracion_edicion = this.uniontramite.configuracion.tiempo_cita

    setTimeout(() => {

      $(document).ready(function() {
        (<any>$("#modaledicionConfiguracionTramite")).modal('open');
      });
      setTimeout(() => {
        $(document).ready(function() {
          (<any>$("#diasedicion")).formSelect();
        });
      }, 100);

    }, 100);
  }

  validadorEdicionConfiguracionTramite(){

  }


  cambarconfiguraciontramite() {

    this.loading = true;

    const resultado = this.horasedicion.find(hora => hora.label == this.horainicialedicion);
    let horainicioformat = '';
    let horafinalformat = '';
    let arraydias = [];
    let diascompletos = [
      { id: 1, name: 'Lunes', code: 'NY', nombre: "lunes", dia_codigo: 1, abreviatura: "lun" },
      { id: 2, name: 'Martes', code: 'RM', nombre: "martes", dia_codigo: 2, abreviatura: "mar" },
      { id: 3, name: 'Miercoles', code: 'LDN', nombre: "miercoles", dia_codigo: 3, abreviatura: "mie" },
      { id: 4, name: 'Jueves', code: 'IST', nombre: "jueves", dia_codigo: 4, abreviatura: "jue" },
      { id: 5, name: 'Viernes', code: 'PRS', nombre: "viernes", dia_codigo: 5, abreviatura: "vie" },
      { id: 6, name: 'Sabado', code: 'PRS', nombre: "sabado", dia_codigo: 6, abreviatura: "sab" },
      { id: 7, name: 'Domingo', code: 'PRS', nombre: "domingo", dia_codigo: 7, abreviatura: "dom" }

    ];
    let variableboolean = false;
    for (var x = 0; x < diascompletos.length; x++) {
      variableboolean = false;
      for (var i = 0; i < this.dias_configuracion_edicion.length; i++) {
        if (diascompletos[x].nombre == this.dias_configuracion_edicion[i].nombre) {
          variableboolean = true;
        }
      }
      arraydias.push(
        { "fin": this.objhora2edicion.labelcompleto, "inicio": resultado.labelcompleto, "nombre": diascompletos[x].nombre, "permitido": variableboolean, "dia_codigo": diascompletos[x].dia_codigo, "abreviatura": diascompletos[x].abreviatura },
      );
    }
    let jsondias = { "dias": arraydias, "tiempo_cita": this.duracion_edicion };
     this.mandaredicionconfiguraciontramite(jsondias);

  }

  mandaredicionconfiguraciontramite(jsondias){
    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.CAMBIAR_CONFIGURACION,
        variables: {
          configuracion: jsondias,
          id_usuario: this.user.id
        }
      }).subscribe(result => {
        $(document).ready(function() {
          (<any>$("#modaledicionConfiguracionTramiteGrobal")).modal('close');
          (<any>$(".modal")).modal('close');

        });
        this.traertramites();
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Configuración actualizado con exito</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
        this.loading = false;
      }, (error) => {

        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al actualizar la configuración</div></span>';
        M.toast({ html: toastHTML , displayLength:40000});
      });
  }

  abrirEdicionConfiguracionTramiteGrobal(){
    this.apollo.use('backproveedores').watchQuery({
      query: A.UNION_TRAMITE,
      variables: {
        id_tramite: this.tramites[0].value
      },
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarUnionTramiteGrobal(result);
      });

  }


  asignarUnionTramiteGrobal(data){

    if(Object.entries(data.data.unionByTramite[0].configuracion).length == 0){

      this.horafinaledicion = null;
      this.citiesedicion = [];
      this.dias_configuracion_edicion = [];

      for(var x = 0; x < this.cities2.length;x++){
          this.citiesedicion.push(this.cities2[x]);
      }

      this.duracion_edicion = null
      this.horainicialedicion = null;

      setTimeout(() => {

        $(document).ready(function() {
          (<any>$("#modaledicionConfiguracionTramiteGrobal")).modal('open');
        });
        setTimeout(() => {
          $(document).ready(function() {
            (<any>$("#diasediciongrobal")).formSelect();
          });
        }, 100);

      }, 100);




    }else{
      this.horafinaledicion = null;
      this.uniontramite = data.data.unionByTramite[0];
      this.citiesedicion = [];
      this.dias_configuracion_edicion = [];

      for(var x = 0; x < this.uniontramite.configuracion.dias.length;x++){
        if(this.uniontramite.configuracion.dias[x].permitido){
          this.citiesedicion.push(this.cities2[x]);
          this.dias_configuracion_edicion.push(this.cities2[x].value);
        }
      }

      let arrayhorainicial = this.uniontramite.configuracion.dias[0].inicio.split(":")
      const resultado = this.horasedicion.find(hora => hora.value == parseInt(arrayhorainicial[0]));
      this.horainicialedicion = resultado.label;
      let duracion = this.uniontramite.configuracion.tiempo_cita;
      this.horasdosedicion = [];
      let horainicio = new Date();
      horainicio.setHours(parseInt(arrayhorainicial[0]));
      horainicio.setMinutes(0);
      horainicio.setSeconds(0);
      let horafinal = new Date();
      horafinal.setHours(18);
      horafinal.setMinutes(0);
      horafinal.setSeconds(0);
      let nuevashoras = horainicio;
      let i = 1;
      let horasfinales = [];
      while (nuevashoras.getTime() < horafinal.getTime()) {
        let fechanew = new Date();
        fechanew.setHours(horainicio.getHours());
        fechanew.setMinutes(0);
        fechanew.setSeconds(0);
        fechanew.setMinutes(horainicio.getMinutes() + (i * duracion));
        nuevashoras = fechanew;
        let minutos = "";
        if (fechanew.getMinutes() < 10) {
          minutos = "0" + fechanew.getMinutes();
        } else {
          minutos = "" + fechanew.getMinutes();
        }
        if (nuevashoras.getTime() < horafinal.getTime()) {
          this.horasdosedicion.push(
            { label: fechanew.getHours() + ":" + minutos, value: fechanew.getHours() + ":" + minutos, labelcompleto: fechanew.getHours() + ":" + minutos + ":00.000" }
          );
        }
        i++;
      }
      let arrayhorafinal = this.uniontramite.configuracion.dias[0].fin.split(":")

      let conjuntofinhora = arrayhorafinal[0] + ':' + arrayhorafinal[1];
      const resultadofinal = this.horasdosedicion.find(hora => hora.label == conjuntofinhora);

      if(resultadofinal!=undefined){
        setTimeout(() => {
          this.horafinaledicion = resultadofinal.label;
          this.objhora2edicion = resultadofinal;
        }, 100);

      }


      this.duracion_edicion = this.uniontramite.configuracion.tiempo_cita

      setTimeout(() => {

        $(document).ready(function() {
          (<any>$("#modaledicionConfiguracionTramiteGrobal")).modal('open');
        });
        setTimeout(() => {
          $(document).ready(function() {
            (<any>$("#diasediciongrobal")).formSelect();
          });
        }, 100);

      }, 100);
    }
   }

   cambarconfiguraciontramiteGrobal(){
     this.loading = true;

     const resultado = this.horasedicion.find(hora => hora.label == this.horainicialedicion);
     let horainicioformat = '';
     let horafinalformat = '';
     let arraydias = [];
     let diascompletos = [
       { id: 1, name: 'Lunes', code: 'NY', nombre: "lunes", dia_codigo: 1, abreviatura: "lun" },
       { id: 2, name: 'Martes', code: 'RM', nombre: "martes", dia_codigo: 2, abreviatura: "mar" },
       { id: 3, name: 'Miercoles', code: 'LDN', nombre: "miercoles", dia_codigo: 3, abreviatura: "mie" },
       { id: 4, name: 'Jueves', code: 'IST', nombre: "jueves", dia_codigo: 4, abreviatura: "jue" },
       { id: 5, name: 'Viernes', code: 'PRS', nombre: "viernes", dia_codigo: 5, abreviatura: "vie" },
       { id: 6, name: 'Sabado', code: 'PRS', nombre: "sabado", dia_codigo: 6, abreviatura: "sab" },
       { id: 7, name: 'Domingo', code: 'PRS', nombre: "domingo", dia_codigo: 7, abreviatura: "dom" }

     ];
     let variableboolean = false;
     for (var x = 0; x < diascompletos.length; x++) {
       variableboolean = false;
       for (var i = 0; i < this.dias_configuracion_edicion.length; i++) {
         if (diascompletos[x].nombre == this.dias_configuracion_edicion[i].nombre) {
           variableboolean = true;
         }
       }
       arraydias.push(
         { "fin": this.objhora2edicion.labelcompleto, "inicio": resultado.labelcompleto, "nombre": diascompletos[x].nombre, "permitido": variableboolean, "dia_codigo": diascompletos[x].dia_codigo, "abreviatura": diascompletos[x].abreviatura },
       );
     }
     let jsondias = { "dias": arraydias, "tiempo_cita": this.duracion_edicion };
      this.mandaredicionconfiguraciontramiteGrobal(jsondias);
   }


   mandaredicionconfiguraciontramiteGrobal(jsondias){
     this.apollo.use('backproveedores')
       .mutate({
         mutation: N.CAMBIAR_CONFIGURACION,
         variables: {
           configuracion: jsondias,
           id_usuario: this.user.id
         }
       }).subscribe(result => {
         $(document).ready(function() {
           (<any>$("#modaledicionConfiguracionTramiteGrobal")).modal('close');
           (<any>$(".modal")).modal('close');

         });
         this.traertramites();
         var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Configuración actualizado con exito</div></span>';
         M.toast({ html: toastHTML , displayLength:40000});
         this.loading = false;
       }, (error) => {

         var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al actualizar la configuración</div></span>';
         M.toast({ html: toastHTML , displayLength:40000});
       });
   }


   abrirmodalConfiguracioGrobal(){
     this.apollo.use('backproveedores').watchQuery({
       query: A.UNION_TRAMITE,
       variables: {
         id_tramite: this.tramites[0].value
       },
       fetchPolicy: 'no-cache'
     })
       .valueChanges.subscribe(result => {
         this.asignarUnionTramiteInfoGrobal(result);
       });


   }


   asignarUnionTramiteInfoGrobal(data) {

     if(Object.entries(data.data.unionByTramite[0].configuracion).length == 0){
       this.enunciadodiastramite = 'N/A';
       this.horainicioinfo = 'N/A'
       this.horafinalinfo = 'N/A'
       $(document).ready(function() {
         (<any>$("#modalinfoTramiteGrobal")).modal('open');

       });
     }else{
       this.uniontramite = data.data.unionByTramite[0];

       this.enunciadodiastramite = '';
       let dias_permitidos = [];

       for(var i = 0; i < this.uniontramite.configuracion.dias.length;i++){
         if(this.uniontramite.configuracion.dias[i].permitido){
           dias_permitidos.push(this.uniontramite.configuracion.dias[i]);
         }
       }


       for(var i = 0; i < dias_permitidos.length;i++){
         if(i == 0){
           this.enunciadodiastramite = this.enunciadodiastramite +  dias_permitidos[i].nombre.toUpperCase()
         }else{
           if(i == dias_permitidos.length-1){
             this.enunciadodiastramite = this.enunciadodiastramite + ' y ' + dias_permitidos[i].nombre.toUpperCase()

           }else{
             this.enunciadodiastramite = this.enunciadodiastramite + ', ' + dias_permitidos[i].nombre.toUpperCase()

           }
          }

       }

       this.horainicioinfo = this.splithora(this.uniontramite.configuracion.dias[0].inicio)
       this.horafinalinfo = this.splithora(this.uniontramite.configuracion.dias[0].fin)

       $(document).ready(function() {
         (<any>$("#modalinfoTramiteGrobal")).modal('open');

       });
     }



   }

   guardarodenamiento(indice,entidades){
     let arrayOrdenamiento = [];
      for(var i = 0; i < entidades.length;i++){
        let obj = {}
        obj['id'] = entidades[i].value;
        obj['ordenamiento'] = i+1;
        arrayOrdenamiento.push(obj);
     }

     let objEnvio = {
       ordenamiento: arrayOrdenamiento
     }

     this.apollo.use('backproveedores')
     .mutate({
      mutation: N.ORDENAR_ENTIDADES,
      variables: {
        ordenamiento: arrayOrdenamiento,
      }
    }).subscribe(result => {      
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ordenamiento cambiado.    </div></span>';
      M.toast({html: toastHTML, displayLength:40000});
      this.traertramites();
       }, (error) => {

      });

   }

   bloqueardias(){
     var today = new Date().toISOString().split('T')[0];
      document.getElementsByName("dateBloqueadoinput")[0].setAttribute('min', today);
   }

   crearRecomendacion(){
     this.recomendacion = null;
     $(document).ready(function() {
       (<any>$("#modalcreateRecomendacion")).modal('open');

     });


   }

   crearRecomendacionEnvio(){

     this.loading = true;

     this.apollo.use('backproveedores')
       .mutate({
         mutation: N.AGREGAR_RECOMENDACION,
         variables: {
           recomendacion: this.recomendacion,
           id_usuario: this.user.id
         }
       }).subscribe(result => {

         $(document).ready(function() {
           (<any>$("#modalcreateRecomendacion")).modal('close');
           (<any>$(".modal")).modal('close');
         });
         this.loading = false;
         this.recomendacion = null;
         this.traerRecomendaciones();
         var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Recomendación creada con exito</div></span>';
         M.toast({ html: toastHTML , displayLength:40000});
       }, (error) => {

         var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp Error al crear la recomendación</div></span>';
         M.toast({ html: toastHTML , displayLength:40000});
       });

   }


   guardarodenamientorecomendaciones(){
     let arrayOrdenamiento = [];
      for(var i = 0; i < this.recomendaciones.length;i++){
        let obj = {}
        obj['id'] = this.recomendaciones[i].id;
        obj['ordenamiento'] = i+1;
        arrayOrdenamiento.push(obj);
     }

     let objEnvio = {
       ordenamiento: arrayOrdenamiento
     }



     this.apollo.use('backproveedores')
     .mutate({
      mutation: N.ORDENAR_RECOMENDACIONES,
      variables: {
        ordenamiento: arrayOrdenamiento,
      }
    }).subscribe(result => {
      
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ordenamiento cambiado.    </div></span>';
      M.toast({html: toastHTML, displayLength:40000});
      this.traerRecomendaciones();
       }, (error) => {

      });

   }

   dardebajarecomendacion(recomendacion){


     this.apollo.use('backproveedores')
     .mutate({
      mutation: N.DAR_BAJA_RECOMENDACIONES,
      variables: {
        id: recomendacion.id,
        id_usuario: this.user.id
      }
    }).subscribe(result => {
      
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Recomendación daba de baja.    </div></span>';
      M.toast({html: toastHTML, displayLength:40000});
      this.traerRecomendaciones();
      this.loading = false;

       }, (error) => {
         this.loading = false;

      });

   }

   dardealtarecomendacion(recomendacion){

     this.apollo.use('backproveedores')
     .mutate({
      mutation: N.DAR_ALTA_RECOMENDACIONES,
      variables: {
        id: recomendacion.id,
        id_usuario: this.user.id
      }
    }).subscribe(result => {
      
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Recomendación activada.    </div></span>';
      M.toast({html: toastHTML, displayLength:40000});
      this.traerRecomendaciones();
      this.loading = false;
       }, (error) => {
         this.loading = false;

      });
   }

}
