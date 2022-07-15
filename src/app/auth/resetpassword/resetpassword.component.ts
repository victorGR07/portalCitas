import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
declare var M: any;
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
 import { SessionStorageService } from '../../core/services/sessionstorage.service';
import { AccountService } from '../autentication.service';
import { UtilsService } from '../utils/utils.service';
import { environment } from 'src/environments/environment';
import { RelacionesInputValidacionesService } from '../../services/validaciones/relacioninputvalidaciones.service';
import { Apollo } from 'apollo-angular';
import * as A from '../../graphql/queries';
import * as N from '../../graphql/mutations';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public password: string;
  public passwordconf: string;
  valid: boolean = false;
  public user: any;
  form: FormGroup;

  constructor(
    private sessionStorageService: SessionStorageService,
    private service: AccountService,
    private formBuilder: FormBuilder,
    private utils: UtilsService,
    public relacionesInputValidacionesService?: RelacionesInputValidacionesService,
    private apollo?: Apollo,

  ) { }
  ngOnInit() {
    this.user = JSON.parse(this.sessionStorageService.get('usuario'));

    this.form = this.formBuilder.group({
      clave_privada: this.formBuilder.control('', {
        validators: [Validators.required]
      }),
      nuevaclave: this.formBuilder.control('',  this.relacionesInputValidacionesService.getValidacion('password'))
    });
  }

  submit(event) {

    if(this.getClavePrivada.value === this.getNuevaClave.value){
      this.apollo.use('backproveedores')
        .mutate({
          mutation: N.ACTUALIZAR_USUARIO,
          variables: {
            id: this.user.id,
            id_rol: this.user.rol.id,
            nombre: this.user.nombre,
            primer_apellido: this.user.primer_apellido,
            segundo_apellido: this.user.segundo_apellido,
            correo: this.user.correo,
            clave_privada: this.utils.hashing(this.getClavePrivada.value),
            id_usuario: this.user.id,
            curp: this.user.curp
          }
        })
        .subscribe(({ data }) => {
          M.toast({html: '<i class="material-icons left">info</i> Contraseña actualizada!'})

          setTimeout(() => {
            let ruta = "/";
            this.service.logout();
            this.sessionStorageService.clean();
            window.location.href = ruta;
        }, 200);


        }, (error) => {
          M.toast({ html: '<i class="material-icons left">info</i> Error al actualizar la contraseña del Usuario!' })
        });
    }else{
      M.toast({html: '<i class="material-icons left">info</i> Las contraseñas deben ser iguales!'})

    }




    /*
    this.apollo.use('backproveedores')
      .mutate({
        mutation: N.ACTUALIZAR_USUARIO,
        variables: {
          id: this.user.id,
          id_rol: this.user.rol.id,
          nombre: this.user.nombre,
          primer_apellido: this.user.primer_apellido,
          segundo_apellido: this.user.segundo_apellido,
          correo: this.user.correo,
          clave_privada: this.utils.hashing(this.getClavePrivada.value),
          id_usuario: this.user.id,
          curp: this.user.curp,
        }
      })
      .subscribe(({ data }) => {
        M.toast({html: '<i class="material-icons left">info</i> Contraseña actualizada!'})

        let ruta = "/";
        this.service.logout();
        this.sessionStorageService.clean();
        window.location.href = ruta;
      }, (error) => {
        M.toast({html: '<i class="material-icons left">info</i> Error en el cambio de contraseña!'})
      });
      */

  }

  get getNuevaClave(): AbstractControl {
    return this.form.get('nuevaclave');
  }

  get getClavePrivada(): AbstractControl {
    return this.form.get('clave_privada');
  }

}
