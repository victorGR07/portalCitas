import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import * as N from '../graphql/mutations';
import * as A from '../graphql/queries';
declare var M: any;
import { SessionStorageService } from '../core/services/sessionstorage.service';
import { UtilsService } from '../auth/utils/utils.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RelacionesInputValidacionesService } from '../services/validaciones/relacioninputvalidaciones.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios = [];
  mostrarListadoUsuarios: boolean = true;
  mostrarCrearUsuario: boolean = false;
  mostrarActualizarUsuario: boolean = false;
  verificarerrores: boolean = false;
  form: FormGroup;
  formActualizar: FormGroup;
  usuarioSeleccionado: any;
  roles = [];
  public user: any;
  displayModal: boolean = false;
  usuarioinfo: any;
  loading: boolean = false;

  curprepetido: boolean = false;
  correorepetido: boolean = false;


  constructor(
    private cdref: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
    private utils: UtilsService,
    private apollo?: Apollo,
    private _route?: ActivatedRoute,
    private _router?: Router,
    private formBuilder?: FormBuilder,
    public relacionesInputValidacionesService?: RelacionesInputValidacionesService,
  ) { }

  ngOnInit() {
    this.usuarios = []
    this.roles = []
    this.traerusuarios();
    this.traerroles();
    this.user = JSON.parse(this.sessionStorageService.get('usuario'));
    this.form = this.formBuilder.group({
      nombre: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('texto')),
      primer_apellido: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('texto')),
      segundo_apellido: this.formBuilder.control('', []),
      correoelectronico: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('correo')),
      curp: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('curp')),
      rol: this.formBuilder.control('', {
        validators: [Validators.required]
      }),
    });

    this.formActualizar = this.formBuilder.group({
      nombre: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('texto')),
      primer_apellido: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('texto')),
      segundo_apellido: this.formBuilder.control('', []),
      correoelectronico: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('correo')),
      curp: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('curp')),
      rol: this.formBuilder.control('', {
        validators: [Validators.required]
      }),
    });
  }

  traerusuarios() {
    this.loading = true;
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_USUARIOS, fetchPolicy: 'network-only'
    })
      .valueChanges.subscribe(result => {
        this.asignarUsuarios(result);
      });
  }

  asignarUsuarios(data) {
    this.usuarios = [];
    for (var i = 0; i < data.data.usuarioPersonalizado.length; i++) {
      let nombrecompleto = data.data.usuarioPersonalizado[i].nombre + ' ' + data.data.usuarioPersonalizado[i].primer_apellido;
      if(data.data.usuarioPersonalizado[i].segundo_apellido!=undefined){
        nombrecompleto = nombrecompleto + ' ' + data.data.usuarioPersonalizado[i].segundo_apellido;
      }
      this.usuarios.push(
        {
          id: data.data.usuarioPersonalizado[i].id,
          nombre: data.data.usuarioPersonalizado[i].nombre,
          primer_apellido: data.data.usuarioPersonalizado[i].primer_apellido,
          segundo_apellido: data.data.usuarioPersonalizado[i].segundo_apellido,
          nombrecompleto: nombrecompleto,
          correo: data.data.usuarioPersonalizado[i].correo,
          curp: data.data.usuarioPersonalizado[i].curp,
          bloqueado: data.data.usuarioPersonalizado[i].bloqueado,
          estatus: data.data.usuarioPersonalizado[i].estatus,
          rol: data.data.usuarioPersonalizado[i].rol,
          created_at: data.data.usuarioPersonalizado[i].created_at,
          clave_privada: data.data.usuarioPersonalizado[i].clave_privada
        }
      );
    }
    this.loading = false;

  }

  traerroles() {
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_ROLES, fetchPolicy: 'network-only'
    })
      .valueChanges.subscribe(result => {
        this.asignarRoles(result);
      });
  }

  asignarRoles(data) {
    this.roles = [];
    for (var i = 0; i < data.data.rolPersonalizado.length; i++) {
      this.roles.push(
        {
          id: data.data.rolPersonalizado[i].id,
          nombre: data.data.rolPersonalizado[i].nombre
        }
      );
    }
  }

  verCrearUsuario() {
    this.form = this.formBuilder.group({
      nombre: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('texto')),
      primer_apellido: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('texto')),
      segundo_apellido: this.formBuilder.control('', []),
      correoelectronico: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('correo')),
      curp: this.formBuilder.control('', this.relacionesInputValidacionesService.getValidacion('curp')),
      rol: this.formBuilder.control('', {
        validators: [Validators.required]
      }),
    });
    this.mostrarListadoUsuarios = false;
    this.mostrarCrearUsuario = true;
    this.mostrarActualizarUsuario = false;
  }


  verActualizarUsuario() {
    this.mostrarListadoUsuarios = false;
    this.mostrarCrearUsuario = false;
    this.mostrarActualizarUsuario = true;
  }

  asignarusuarioedicion(usuario) {
    this.usuarioSeleccionado = usuario;
    let rol = this.roles.find(rol => rol.id == this.usuarioSeleccionado.rol.id);
    this.formActualizar = this.formBuilder.group({
      nombre: this.formBuilder.control(this.usuarioSeleccionado.nombre, this.relacionesInputValidacionesService.getValidacion('texto')),
      primer_apellido: this.formBuilder.control(this.usuarioSeleccionado.primer_apellido, this.relacionesInputValidacionesService.getValidacion('texto')),
      segundo_apellido: this.formBuilder.control(this.usuarioSeleccionado.segundo_apellido, []),
      curp: this.formBuilder.control({ value: this.usuarioSeleccionado.curp, disabled: true } , []),

      correoelectronico: this.formBuilder.control(this.usuarioSeleccionado.correo, this.relacionesInputValidacionesService.getValidacion('correo')),
      rol: this.formBuilder.control(rol, {
        validators: [Validators.required]
      }),
    });
    this.verActualizarUsuario();
  }

  regresar() {
    this.mostrarListadoUsuarios = true;
    this.mostrarCrearUsuario = false;
    this.mostrarActualizarUsuario = false;
  }


  comprobarCorreo() {
    if(this.getCorreo.value.length > 0){
      this.apollo.use('backproveedores').watchQuery({
        query: A.GET_USUARIOS,
        variables:
        {
          correo: this.getCorreo.value
        },
        fetchPolicy: 'no-cache'
      })
        .valueChanges.subscribe(result => {
          this.verificarCorreo(result);
        });
    }
  }



  verificarCorreo(data){
    this.correorepetido = false;
    if(data.data.usuarioPersonalizado.length>0){
      M.toast({ html: '<i class="material-icons left">info</i> Correo repetido!' })
      this.correorepetido = true;
    }
  }


  comprobarCorreoEdicion(){
    if(this.getCorreoEdicion.value.length > 0){
      this.apollo.use('backproveedores').watchQuery({
        query: A.GET_USUARIOS,
        variables:
        {
          correo: this.getCorreoEdicion.value
        },
        fetchPolicy: 'no-cache'
      })
        .valueChanges.subscribe(result => {
          this.verificarCorreoEdicion(result);
        });
    }
  }

  verificarCorreoEdicion(data){
    this.correorepetido = false;
    if(data.data.usuarioPersonalizado.length>0){
      if(data.data.usuarioPersonalizado[0].id != this.usuarioSeleccionado.id){
        M.toast({ html: '<i class="material-icons left">info</i> Correo repetido!' })
        this.correorepetido = true;
      }

    }
  }

  comprobarCURP() {
    if(this.getCurp.value.length == 18){
      this.apollo.use('backproveedores').watchQuery({
        query: A.GET_USUARIOS,
        variables:
        {
          curp: this.getCurp.value.toUpperCase()
        },
        fetchPolicy: 'no-cache'
      })
        .valueChanges.subscribe(result => {
          this.verificarCurp(result);
        });
    }
  }

  verificarCurp(data){
    this.curprepetido = false;
    if(data.data.usuarioPersonalizado.length>0){
      M.toast({ html: '<i class="material-icons left">info</i> CURP repetido!' })
      this.curprepetido = true;

    }
  }

  submit(event) {
    this.verificarerrores = this.form.invalid;
    if (!this.form.invalid) {
      this.loading = true;
      var str = this.generatePassword(8);
      this.apollo.use('backproveedores')
        .mutate({
          mutation: N.CREAR_USUARIO,
          variables: {
            id_rol: this.getRole.value.id,
            nombre: this.getNombre.value.toUpperCase(),
            primer_apellido: this.getPrimerApellido.value.toUpperCase(),
            segundo_apellido: this.getSegundoApellido.value,
            correo: this.getCorreo.value,
            clave_privada: this.utils.hashing(str),
            id_usuario: this.user.id,
            curp: this.getCurp.value.toUpperCase(),
            clave: str,

          }
        })
        .subscribe(({ data }) => {
          M.toast({ html: '<i class="material-icons left">info</i> Usuario agregado!' })
          this.traerusuarios();
          this.regresar();
          this.loading = false;

        }, (error) => {
          var divisiones = error.message.split(":", 2);
           M.toast({ html: '<i class="material-icons left">info</i> Error al crear el Usuario!' })
           M.toast({html: divisiones[1]})
           this.loading = false;

        });
    }

  }

  submitEdicion(event) {
    this.verificarerrores = this.formActualizar.invalid;
    if (!this.formActualizar.invalid) {
      this.loading = true;
      var str = '';
      var ref = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
      for (var i=0; i<4; i++)
       {
         str += ref.charAt(Math.floor(Math.random()*ref.length));
       }
       let segundo_apellido = null;
       if(this.getSegundoApellidoEdicion.value!=undefined && (this.getSegundoApellidoEdicion.value!=undefined && this.getSegundoApellidoEdicion.value.trim().length>0)){
         segundo_apellido = this.getSegundoApellidoEdicion.value.toUpperCase()
       }

      this.apollo.use('backproveedores')
        .mutate({
          mutation: N.ACTUALIZAR_USUARIO,
          variables: {
            id: this.usuarioSeleccionado.id,
            id_rol: this.getRoleEdicion.value.id,
            nombre: this.getNombreEdicion.value,
            primer_apellido: this.getPrimerApellidoEdicion.value,
            segundo_apellido: segundo_apellido,
            correo: this.getCorreoEdicion.value,
            clave_privada: this.usuarioSeleccionado.clave_privada,
            id_usuario: this.user.id,
            curp: this.usuarioSeleccionado.curp,
          }
        })
        .subscribe(({ data }) => {
          M.toast({ html: '<i class="material-icons left">info</i> Usuario actualizado!' })
          this.traerusuarios();
          this.regresar();
          this.loading = false;

        }, (error) => {
          this.loading = false;
          M.toast({ html: '<i class="material-icons left">info</i> Error al actualizar el Usuario!' })
        });
    }

  }

  funcioncrearfecha(stringdate: any) {
    var res = stringdate.split("T");
    var arrayDeCadenas2 = res[0].split('-');
    let fecha = new Date(parseInt(arrayDeCadenas2[0]), parseInt(arrayDeCadenas2[1]) - 1, parseInt(arrayDeCadenas2[2]));
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
    var resinicio = res[1].split(":");
    return anio21 + "-" + mes21 + "-" + dia21;
  }

  abrirmodalcambioestatus(usuario) {
    this.usuarioSeleccionado = usuario;
    let that = this;
    if (this.usuarioSeleccionado.estatus) {
      Swal.fire({
        title: '¿Desea deshabilitar el usuario?',
        confirmButtonText: 'Deshabilitar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
      }).then(function(result) {
        if (result.isConfirmed) {
          that.apollo.use('backproveedores')
            .mutate({
              mutation: N.BLOQUEAR_USUARIO_ACTIVO,
              variables: {
                id: that.usuarioSeleccionado.id,
                accion: 2,
                valor: false,
                id_usuario: that.user.id
              }
            })
            .subscribe(({ data }) => {
              M.toast({ html: '<i class="material-icons left">info</i> Usuario Desactivado!' })
              that.traerusuarios();
              that.regresar();
            }, (error) => {
              M.toast({ html: '<i class="material-icons left">info</i> Error al intentar desactivar el usuario!' })
            });
        }
      })
    } else {
      Swal.fire({
        title: '¿Desea habilitar el usuario?',
        confirmButtonText: 'Activar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
      }).then(function(result) {
        if (result.isConfirmed) {
          that.apollo.use('backproveedores')
            .mutate({
              mutation: N.BLOQUEAR_USUARIO_ACTIVO,
              variables: {
                id: that.usuarioSeleccionado.id,
                accion: 2,
                valor: true,
                id_usuario: that.user.id
              }
            })
            .subscribe(({ data }) => {
              M.toast({ html: '<i class="material-icons left">info</i> Usuario Desactivado!' })
              that.traerusuarios();
              that.regresar();
            }, (error) => {
              M.toast({ html: '<i class="material-icons left">info</i> Error al intentar habilitar el usuario!' })
            });
        }
      })
    }
  }

  abrirmodalcambiobloqueado(usuario) {
    this.usuarioSeleccionado = usuario;
    let that = this;
    if (this.usuarioSeleccionado.bloqueado) {
      Swal.fire({
        title: '¿Desea desbloquear el usuario?',
        confirmButtonText: 'Habilitar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
      }).then(function(result) {
        if (result.isConfirmed) {
          that.apollo.use('backproveedores')
            .mutate({
              mutation: N.BLOQUEAR_USUARIO_ACTIVO,
              variables: {
                id: that.usuarioSeleccionado.id,
                accion: 1,
                valor: false,
                id_usuario: that.user.id
              }
            })
            .subscribe(({ data }) => {
              M.toast({ html: '<i class="material-icons left">info</i> Usuario Desbloqueado!' })
              that.traerusuarios();
              that.regresar();
            }, (error) => {
              M.toast({ html: '<i class="material-icons left">info</i> Error al intentar desbloquear el Usuario!' })
            });
        }
      })
    } else {
      Swal.fire({
        title: '¿Desea bloquear el usuario?',
        confirmButtonText: 'Bloquear',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
      }).then(function(result) {
        if (result.isConfirmed) {
          that.apollo.use('backproveedores')
            .mutate({
              mutation: N.BLOQUEAR_USUARIO_ACTIVO,
              variables: {
                id: that.usuarioSeleccionado.id,
                accion: 1,
                valor: true,
                id_usuario: that.user.id

              }
            })
            .subscribe(({ data }) => {
              M.toast({ html: '<i class="material-icons left">info</i> Usuario Bloqueado!' })

              that.traerusuarios();
              that.regresar();
            }, (error) => {
              M.toast({ html: '<i class="material-icons left">info</i> Error al intentar bloquear el usuario!' })
            });
        }
      })
    }
  }

  verinformacion(usuario){
    this.displayModal = true;
    this.usuarioinfo = usuario;


  }

  reestablecercontrasenia(usuario){
    let that = this;

    Swal.fire({
      title: '¿Desea cambiar la contraseña del usuario ' +usuario.nombrecompleto+'?',
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then(function(result) {

      if (result.isConfirmed) {

        var str = that.generatePassword(8);

         let segundo_apellido = null;
         if(usuario.segundo_apellido!=undefined && (usuario.segundo_apellido!=undefined && usuario.segundo_apellido.trim().length>0)){
           segundo_apellido = usuario.segundo_apellido
         }


        that.apollo.use('backproveedores')
          .mutate({
            mutation: N.ACTUALIZAR_USUARIO,
            variables: {
              id: usuario.id,
              id_rol: usuario.rol.id,
              nombre: usuario.nombre,
              primer_apellido: usuario.primer_apellido,
              segundo_apellido: segundo_apellido,
              correo: usuario.correo,
              clave_privada: that.utils.hashing(str),
              id_usuario: that.user.id,
              curp: usuario.curp,
              clave: str
            }
          })
          .subscribe(({ data }) => {
            M.toast({ html: '<i class="material-icons left">info</i> Contraseña actualizada, se envio al correo del Usuario!' })
            that.traerusuarios();
            that.regresar();
          }, (error) => {
            M.toast({ html: '<i class="material-icons left">info</i> Error al actualizar la contraseña del Usuario!' })
          });

      }
    })

  }

  generatePassword(passwordLength) {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";

  var allChars = numberChars + upperChars + lowerChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return this.shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
}

shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

  get getNombre(): AbstractControl {
    return this.form.get('nombre');
  }

  get getPrimerApellido(): AbstractControl {
    return this.form.get('primer_apellido');
  }

  get getSegundoApellido(): AbstractControl {
    return this.form.get('segundo_apellido');
  }

  get getCurp(): AbstractControl {
    return this.form.get('curp');
  }

  get getCorreo(): AbstractControl {
    return this.form.get('correoelectronico');
  }


  get getRole(): AbstractControl {
    return this.form.get('rol');
  }

  get getNombreEdicion(): AbstractControl {
    return this.formActualizar.get('nombre');
  }

  get getPrimerApellidoEdicion(): AbstractControl {
    return this.formActualizar.get('primer_apellido');
  }

  get getSegundoApellidoEdicion(): AbstractControl {
    return this.formActualizar.get('segundo_apellido');
  }

  get getCorreoEdicion(): AbstractControl {
    return this.formActualizar.get('correoelectronico');
  }

  get getPasswordEdicion(): AbstractControl {
    return this.formActualizar.get('password');
  }

  get getRoleEdicion(): AbstractControl {
    return this.formActualizar.get('rol');
  }
}
