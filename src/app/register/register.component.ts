import { Component, OnInit } from "@angular/core";
import { Apollo } from 'apollo-angular';
import * as A from '../graphql/queries';
import * as N from '../graphql/mutations';
declare var M: any;
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RelacionesInputValidacionesService } from '../core/services/validaciones/relacioninputvalidaciones.service';
import { CreadorComponentesPDFService } from '../services/pdfmake/creacionComponentes.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  tramites = [];
  tramiteSeleccionado: any;
  divtramite1: boolean = true;
  divdiahora2: boolean = false;
  divcaptura3: boolean = false;
  divfinalizar4: boolean = false;
  mostrarFormulario: boolean = false;
  date2: Date;
  horas: any;
  tramiteseleccionadolabel: any;
  minDate: any;
  maxDate: any;
  horaSeleccionada: any;
  diasdisabled = [];
  diasdeshabilitadoscargados: boolean = false;
  loading: boolean = false;
  dias: any;
  diasdisabled2 = [];
  diahoy: any;
  mensajesinHoras: boolean = false;
  disabledHora: boolean = true;
  es: any;
  datecita: any;
  dialimite: boolean = false;
  personafisicaopcion: boolean = true;
  personamoralopcion: boolean = false;
  public boxForm: FormGroup;
  uniontramite: any;
  verificarerrores: boolean = false;

  objCita: any;
  idFolio: any;
  recomendaciones: any;
  descripciontramite: any;

  constructor(
    private apollo?: Apollo,
    private formBuilder?: FormBuilder,
    public relacionesInputValidacionesService?: RelacionesInputValidacionesService,
    public creadorComponentesPDFService?: CreadorComponentesPDFService,

  ) {
  }

  ngOnInit() {
    this.idFolio = '0000';
    this.diahoy = new Date();
    this.minDate = new Date();
    this.minDate.setDate(this.diahoy.getDate()+1);

    this.traerTope();
    this.traertramites();
    this.traerDias();
    this.traerRecomendaciones();
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
  }


  traerRecomendaciones(){
    this.loading = true;
    this.recomendaciones = [];
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_RECOMENDACIONES,
      fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.asignarRecomendaciones(result);
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error, favor de verificar su conexión a Internet.    </div></span>';
        M.toast({ html: toastHTML });
      });
  }

  asignarRecomendaciones(data){
     for(var i = 0; i < data.data.recomendacionPersonalizado.length;i++){
      this.recomendaciones.push(
        {
          id: data.data.recomendacionPersonalizado[i].id,
          recomendacion: data.data.recomendacionPersonalizado[i].recomendacion,
          estatus: data.data.recomendacionPersonalizado[i].estatus
        }
      );
    }


  }

  traerTope() {
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_TOPE,
      fetchPolicy: 'network-only'
    })
      .valueChanges.subscribe(result => {
        this.asignarTope(result);
      }, (error) => {

        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error 389. Error en red.    </div></span>';
        M.toast({ html: toastHTML });
      });
  }

  asignarTope(data) {
    if (data.data.fecha_configuracion != null) {
      this.maxDate = new Date(data.data.fecha_configuracion.fecha);
      this.dialimite = true;
    } else {
      this.dialimite = false;
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Error 399. Error en red.    </div></span>';
      M.toast({ html: toastHTML });
    }
  }

  traertramites() {
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_TRAMITES, fetchPolicy: 'network-only'
    })
      .valueChanges.subscribe(result => {
        this.asignarTramites(result);
      });
  }

  asignarTramites(data) {
    this.tramites = [];
    for (var i = 0; i < data.data.tramites.length; i++) {
      this.tramites.push(
        {
          value: data.data.tramites[i].id,
          label: data.data.tramites[i].nombre,
          descripcion: data.data.tramites[i].descripcion
        }
      )
    }
  }

  cambioTramite(event) {
    const resultado = this.tramites.find(tramite => tramite.value == String(this.tramiteSeleccionado));
    this.descripciontramite = resultado.descripcion;
  }

  segundoPaso() {
    this.mostrarFormulario = false;
    const resultado = this.tramites.find(tramite => tramite.value == String(this.tramiteSeleccionado));
    this.tramiteseleccionadolabel = resultado;
    this.apollo.use('backproveedores').watchQuery({
      query: A.UNION_TRAMITE,
      variables: {
        id_tramite: this.tramiteseleccionadolabel.value
      },
      fetchPolicy: 'network-only'
    })
      .valueChanges.subscribe(result => {
        this.asignarUnionTramite(result);
      });
  }

  primerPaso() {
    this.divtramite1 = true;
    this.divdiahora2 = false;
    this.divcaptura3 = false;
    this.divfinalizar4 = false;
    document.getElementById("divheader1").style.backgroundColor = "white";
    document.getElementById("divheader2").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader3").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader4").style.backgroundColor = "#F1F1F1";
    this.date2 = null;
    this.horas = null;
  }

  asignarUnionTramite(data) {
    this.uniontramite = data.data.unionByTramite;
    this.divtramite1 = false;
    this.divdiahora2 = true;
    this.divcaptura3 = false;
    this.divfinalizar4 = false;
    document.getElementById("divheader1").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader2").style.backgroundColor = "white";
    document.getElementById("divheader3").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader4").style.backgroundColor = "#F1F1F1";
    this.date2 = null;
    this.horas = null;
  }

  cambioDia() {
    if (this.date2 != null) {
      let diasdisabled = [new Date(2020, 2, 16), new Date(2020, 3, 9), new Date(2020, 3, 10), new Date(2020, 4, 1), new Date(2020, 4, 30)];
      let variable = false;
      for (var o = 0; o < this.diasdisabled2.length; o++) {
        if (this.date2.getDate() == this.diasdisabled2[o].getDate() && this.date2.getMonth() == this.diasdisabled2[o].getMonth()) {
          variable = true;
        }
      }
      let diatomorro = new Date();
      diatomorro.setDate(diatomorro.getDate() + 1);
      diatomorro.setHours(0);
      diatomorro.setMinutes(0);
      diatomorro.setSeconds(0);
      this.date2.setHours(0);
      this.date2.setMinutes(0);
      this.date2.setSeconds(0);
      let dia30dias = this.maxDate;
      dia30dias.setHours(0);
      dia30dias.setMinutes(0);
      dia30dias.setSeconds(0);
      if (this.date2.getTime() > dia30dias.getTime()) {
        variable = true;
      }
      if (this.date2.getTime() < this.diahoy.getTime()) {
        variable = true;
      }
      if (this.date2.getDate() == diatomorro.getDate() && this.date2.getMonth() == diatomorro.getMonth() && variable == false) {
        variable = false;
      }
      var day = this.date2.getDay()
      if (day === 6 || day === 0) {
        variable = true;
      }
      if (variable == true) {
        this.date2 = null;
        this.disabledHora = true;
        this.horaSeleccionada = null;
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Día no disponible para selección de citas.</div></span>';
        M.toast({ html: toastHTML });
      } else {
        this.loading = true;
        this.disabledHora = true;
        this.horaSeleccionada = null;
        this.apollo.use('backproveedores').watchQuery({
          query: A.GET_HORAS,
          variables: {
            id_tramite: this.tramiteseleccionadolabel.value,
            fecha: this.date2
          }, fetchPolicy: 'network-only'
        })
          .valueChanges.subscribe(result => {
            this.asignarHoras(result);
          }, (error) => {
            var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error.    </div></span>';
            M.toast({ html: toastHTML });
          });
      }
    }
  }

  cambioHora(event) {
    this.datecita = this.date2;
    this.datecita.setHours(parseInt(this.horaSeleccionada.hora), parseInt(this.horaSeleccionada.minuto), 0);
  }

  asignarHoras(data: any) {
    this.horas = [];
    for (let i = 0; i < data.data.getFreeTimeByTramite.length; i++) {
      if (data.data.getFreeTimeByTramite[i] != null) {
        var str = data.data.getFreeTimeByTramite[i];
        var res = str.split(":");
        this.horas.push(
          { name: data.data.getFreeTimeByTramite[i], value: i, hora: res[0], minuto: res[1] }
        );
      }
    }
    if (this.horas.length == 0) {
      this.mensajesinHoras = true;
    } else {
      this.mensajesinHoras = false;
    }
    this.loading = false;
    this.disabledHora = false;
  }

  mostradias() {
    var x = document.getElementsByClassName("ui-state-default");
    var mouth = document.getElementsByClassName("ui-datepicker-month");
    var year = document.getElementsByClassName("ui-datepicker-year");
    if (mouth.length > 0) {
      for (var i = 0; i < x.length; i++) {
        var aux = (<HTMLInputElement>x[i]);
        var aux2 = (<HTMLInputElement>mouth[0]);
        var diames = aux.innerText + ' ' + aux2.innerText;
        for (var o = 0; o < this.diasdisabled.length; o++) {
          if (this.diasdisabled[o] == diames) {
            aux.className = "ui-state-default ng-tns-c3-4 ui-state-disabled ng-star-inserted";
            var elemEventHandler = function() { };
            aux.removeEventListener("click", elemEventHandler, false);
          }
        }
      }
    }
  }

  traerDias() {
    this.diasdeshabilitadoscargados = false;
    this.loading = true;
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_DIAS_BLOQ,
      fetchPolicy: 'network-only'
    })
      .valueChanges.subscribe(result => {
        this.asignarDias(result);
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error, favor de verificar su conexión a Internet.    </div></span>';
        M.toast({ html: toastHTML });
      });
  }

  asignarDias(data: any) {
    this.dias = data.data.dias;
    let arreglodias = [];
    for (var i = 0; i < data.data.dias.length; i++) {
      if (data.data.dias[i].deprecated == false) {
        let diahora = data.data.dias[i].fecha;
        var str = diahora;
        var res = str.split("-");
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let indice = parseInt(res[1]);
        let horacita = parseInt(res[0]) + " " + meses[indice - 1] + ' ';
        this.diasdisabled.push(horacita);
        this.diasdisabled2.push(new Date(parseInt(res[2]), indice - 1, parseInt(res[0])));
      }
    }
    this.loading = false;
    this.diasdeshabilitadoscargados = true;
  }

  tercerPaso() {
    this.divtramite1 = false;
    this.divdiahora2 = false;
    this.divcaptura3 = true;
    this.divfinalizar4 = false;
    document.getElementById("divheader1").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader2").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader3").style.backgroundColor = "white";
    document.getElementById("divheader4").style.backgroundColor = "#F1F1F1";
    $(document).ready(function(){
      (<any>$("#telefono")).characterCounter();
      (<any>$("#rfcMoral")).characterCounter();
      (<any>$("#rfc")).characterCounter();

    });
  }

  buscarporpersonafisica() {
    this.mostrarFormulario = true;

    this.personafisicaopcion = true;
    this.personamoralopcion = false;
     this.boxForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createBox()])
    });

    $(document).ready(function(){
      (<any>$("#telefono")).characterCounter();
      (<any>$("#rfcMoral")).characterCounter();
      (<any>$("#rfc")).characterCounter();

    });
  }

  buscarporpersonamoral() {
    this.mostrarFormulario = true;

    this.personafisicaopcion = false;
    this.personamoralopcion = true;
    this.boxForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createBox()])
    });

    $(document).ready(function(){
      (<any>$("#telefono")).characterCounter();
      (<any>$("#rfcMoral")).characterCounter();
      (<any>$("#rfc")).characterCounter();

    });
  }

  createBox(): FormGroup {
    if (this.personafisicaopcion) {
      return this.formBuilder.group({
        nombre: ['', [Validators.required]],
        primerApellido: ['', [Validators.required]],
        segundoApellido: [null, []],
        rfc: ['', this.relacionesInputValidacionesService.getValidacion('rfc')],
        telefono: ['', this.relacionesInputValidacionesService.getValidacion('telefono')],
        email: ['', this.relacionesInputValidacionesService.getValidacion('correorequerido')],
      });

    }
    if (this.personamoralopcion) {
      return this.formBuilder.group({
        razonSocial: ['', [Validators.required]],
        rfc: ['', this.relacionesInputValidacionesService.getValidacion('rfcmoral')],
        telefono: ['', this.relacionesInputValidacionesService.getValidacion('telefono')],
        email: ['', this.relacionesInputValidacionesService.getValidacion('correorequerido')],
      });
    }
  }

  get items(): FormArray {
    return this.boxForm.get('items') as FormArray;
  }

  verificardatos(){
    if (this.personafisicaopcion) {
      this.boxForm.get('items')['controls'][0]['controls'].nombre.setValue(this.boxForm.get('items')['controls'][0]['controls'].nombre.value.trim());
      this.boxForm.get('items')['controls'][0]['controls'].primerApellido.setValue(this.boxForm.get('items')['controls'][0]['controls'].primerApellido.value.trim());

    }
    if (this.personamoralopcion) {
      this.boxForm.get('items')['controls'][0]['controls'].razonSocial.setValue(this.boxForm.get('items')['controls'][0]['controls'].razonSocial.value.trim());

    }


    this.boxForm.get('items')['controls'][0]['controls'].rfc.setValue(this.boxForm.get('items')['controls'][0]['controls'].rfc.value.trim());
    this.boxForm.get('items')['controls'][0]['controls'].telefono.setValue(this.boxForm.get('items')['controls'][0]['controls'].telefono.value.trim());
    this.boxForm.get('items')['controls'][0]['controls'].email.setValue(this.boxForm.get('items')['controls'][0]['controls'].email.value.trim());

    this.verificarerrores = this.boxForm.invalid;
    if (!this.boxForm.invalid) {
      this.verificarRFC();
    }
  }

  verificarRFC(){
    this.apollo.use('backproveedores').watchQuery({
      query: A.VALIDAR_CITA,
      variables: {
        rfc: this.boxForm.get('items')['controls'][0]['controls'].rfc.value,
        fecha: this.date2
      }, fetchPolicy: 'no-cache'
    })
      .valueChanges.subscribe(result => {
        this.verificarDatosRFC(result);
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error.    </div></span>';
        M.toast({ html: toastHTML });
      });
  }

  verificarDatosRFC(data){

    if(data.data.canMakeCita){
      this.cuartopaso();
    }else{
      var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp; RFC con una cita agendada.    </div></span>';
      M.toast({html: toastHTML});
    }
  }

  cuartopaso() {

    this.divtramite1 = false;
    this.divdiahora2 = false;
    this.divcaptura3 = false;
    this.divfinalizar4 = true;
    document.getElementById("divheader1").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader2").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader3").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader4").style.backgroundColor = "white";
  }

  cancelarCita() {
    window.location.href = "/cita";
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

  registrarCita() {
    this.loading = true;
    let dia = this.date2.getDate().toString();
    let anio = this.date2.getFullYear().toString();
    let mes = "";
    if ((this.date2.getMonth() + 1) < 10) {
      mes = "0" + (this.date2.getMonth() + 1).toString();
    } else {
      mes = (this.date2.getMonth() + 1).toString();
    }
    if ((this.date2.getDate() + 1) <= 10) {
      dia = "0" + (this.date2.getDate()).toString();
    } else {
      dia = (this.date2.getDate()).toString();
    }
    let diacita = anio + "/" + mes + "/" + dia;
    let horaEnvio = this.datecita.getHours();
    let minutoEnvio = this.datecita.getMinutes();
    let segundoEnvio = this.datecita.getSeconds();
    let horaImprimible = ("0" + horaEnvio).slice(-2) + ":" + ("0" + minutoEnvio).slice(-2);
    let nombre = null;
    let primer_apellido = null;
    let segundo_apellido = null;
    let razon_social = null;
    let tipo_persona = '';
    let obj_envio = {
      rfc: this.boxForm.get('items')['controls'][0]['controls'].rfc.value.toUpperCase(),
      telefono: this.boxForm.get('items')['controls'][0]['controls'].telefono.value,
      email: this.boxForm.get('items')['controls'][0]['controls'].email.value,
      fecha: diacita,
      hora: horaImprimible,
      union_tramite_configuracion: this.uniontramite[0].id
    }
    if (this.personafisicaopcion) {
      tipo_persona = 'F';
      nombre = this.boxForm.get('items')['controls'][0]['controls'].nombre.value.toUpperCase();
      primer_apellido = this.boxForm.get('items')['controls'][0]['controls'].primerApellido.value.toUpperCase();
      obj_envio['nombre'] = nombre;
      obj_envio['primer_apellido'] = primer_apellido;
       if(this.boxForm.get('items')['controls'][0]['controls'].segundoApellido.value!=null){
        if(this.boxForm.get('items')['controls'][0]['controls'].segundoApellido.value.trim() != ''){
          segundo_apellido = this.boxForm.get('items')['controls'][0]['controls'].segundoApellido.value.toUpperCase();
         }
      }

      obj_envio['segundo_apellido'] = segundo_apellido;


    }
    if (this.personamoralopcion) {
      tipo_persona = 'M';
      razon_social = this.boxForm.get('items')['controls'][0]['controls'].razonSocial.value.toUpperCase();
      obj_envio['razon_social'] = razon_social;

    }
    obj_envio['tipo_persona'] = tipo_persona;


    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.CREATE_CITA,
        variables: obj_envio
      }).subscribe(result => {
        this.loading = false;

        this.mandaraimprimir(result.data);
      }, (error) => {
      this.loading = false;

          var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;' + error.message +'.</div></span>';
          M.toast({ html: toastHTML });

      });

  }

  salirModalFinalizado() {
    var delayInMilliseconds = 2000; //1 second
    setTimeout(function(
    ) {
      window.location.href = "/cita";
    }, delayInMilliseconds);
  }

  regresarsincupo() {
    this.divtramite1 = false;
    this.divdiahora2 = true;
    this.divcaptura3 = false;
    this.divfinalizar4 = false;
    document.getElementById("divheader1").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader2").style.backgroundColor = "white";
    document.getElementById("divheader3").style.backgroundColor = "#F1F1F1";
    document.getElementById("divheader4").style.backgroundColor = "#F1F1F1";
    this.loading = true;
    this.disabledHora = true;
    this.horaSeleccionada = null;
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_HORAS,
      variables: {
        id_tramite: this.tramiteseleccionadolabel.value,
        fecha: this.date2
      }, fetchPolicy: 'network-only'
    })
      .valueChanges.subscribe(result => {
        this.asignarHoras(result);
      }, (error) => {
        var toastHTML = '<span> <div class="valign-wrapper"><i class="material-icons">error_outline</i>  &nbsp;&nbsp;Ocurrio un error.    </div></span>';
        M.toast({ html: toastHTML });
      });
  }

  mandaraimprimir(data) {
    $(document).ready(function() {
      (<any>$(".modal")).modal({ dismissible: false });
      (<any>$("#modalFinalizarCita")).modal('open');
    });
    this.objCita = data.cita;
    var concatenado = "";
    let auxiliar = String(this.objCita.folio_general);
    for (var i = 0; i < (4-auxiliar.length); i++) {
      concatenado = concatenado + "0";
    }
    this.idFolio = concatenado + auxiliar;
    this.creadorComponentesPDFService.crearComprobanteCitaPrueba(data.cita,this.recomendaciones);
  }

  reemplazarrfc(){
    let rfcopcional = this.boxForm.get('items')['controls'][0]['controls'].rfc.value.trim().toUpperCase();
    this.boxForm.get('items')['controls'][0]['controls'].rfc.setValue(rfcopcional);

  }




}
