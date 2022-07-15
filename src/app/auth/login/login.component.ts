import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UtilsService } from '../utils/utils.service';
import { Router } from '@angular/router';
import { slideAnimation } from '../transition';
declare var M: any;
import * as A from '../../graphql/queries';

import { environment } from 'src/environments/environment';
import {Apollo} from 'apollo-angular';
import { SessionStorageService } from '../../core/services/sessionstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  pass: any;
  loading: boolean = false;
  environment: any;

  constructor(
    private formBuilder: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private utils: UtilsService,
    private router?: Router,
    private apollo?: Apollo,

  ) { }

  ngOnInit(): void {
    this.environment = environment;
    this.form = this.formBuilder.group({
      correo_electronico: this.formBuilder.control('', {
        validators: [Validators.required]
      }),
      clave_privada: this.formBuilder.control('', {
        validators: [Validators.required]
      })
    });
  }

  submit(event) {
    this.apollo.use('backproveedores').watchQuery({
      query: A.GET_USUARIOS,
      variables: {
        correo: this.getCorreoElectronico.value,
        clave_privada: this.utils.hashing(this.getClavePrivada.value)
      },
      fetchPolicy: 'network-only'
    })
    .valueChanges.subscribe(result => {
      this.verificarUsuario(result);
    });
  }


  verificarUsuario(data){
    if(data.data.usuarioPersonalizado.length>0){
    this.sessionStorageService.set("usuario", JSON.stringify(data.data.usuarioPersonalizado[0]))
    window.location.href = "/pendientes";

    }else{
      M.toast({html: '<i class="material-icons left">info</i> Acceso denegado!'})
    }
  }

  get getCorreoElectronico(): AbstractControl {
    return this.form.get('correo_electronico');
  }

  get getClavePrivada(): AbstractControl {
    return this.form.get('clave_privada');
  }
}
