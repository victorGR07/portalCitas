import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import {ValidatorForm} from './validacion'

@Injectable({
  providedIn: 'root'
})
export class RelacionesInputValidacionesService {
  constructor() { }
  getValidacion(llave){
    let validaciones = [];
    if(llave=='$numero_expediente$'){
      validaciones.push(Validators.required);
    }
    if(llave=='$curp_auxiliar$'){
      validaciones.push(Validators.required);

    }
    if(llave=='$registro_acta$'){
      validaciones.push(Validators.required);

    }
    if(llave=='$numero_resolucion$'){
      validaciones.push(Validators.required);

    }
    if(llave=='$fecha_resolucion$'){
      validaciones.push(Validators.required);
    }
    if(llave=='curp'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.curpValidator);
    }
    if(llave=='rfc'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.rfcValidator);
    }
    if(llave=='nombreVialidad'){
      validaciones.push(Validators.required);
    }
    if(llave=='numeroInterior'){
    }
    if(llave=='numeroExterior'){
      validaciones.push(Validators.required);
    }
    if(llave=='nombreAsentamiento'){
      validaciones.push(Validators.required);
    }
    if(llave=='codigoPostal'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.numberValidator);

    }
    if(llave=='escolaridad'){
      validaciones.push(Validators.required);
    }
    if(llave=='estadocivil'){
      validaciones.push(Validators.required);
    }
    if(llave=='telefono'){
      validaciones.push(ValidatorForm.telefonoValidator);

    }
    if(llave=='correo'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.correoValidator);

    }
    if(llave=='nuc'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.nucValidator);

    }
    if(llave=='nombre'){
      validaciones.push(Validators.required);
    }
    if(llave=='texto'){
      validaciones.push(Validators.required);
    }

    if(llave=='password'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.passwordValidator);
    }
    return validaciones;
  }

  getValidacionComprobacion(llave){
    let validaciones = [];
    if(llave=='municipio'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.municipioValidator);
    }
    if(llave=='localidad'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.localidadValidator);
    }
    if(llave=='agencia'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.tipoVialidadValidator);
    }
    if(llave=='tipoVialidad'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.tipoVialidadValidator);
    }
    if(llave=='tipoAsentamiento'){
      validaciones.push(Validators.required);
      validaciones.push(ValidatorForm.tipoAsentamientoValidator);
    }
    if(llave=='id_modalidad_trabajo'){
      validaciones.push(Validators.required);
    }
    if(llave=='id_puesto_laboral'){
      validaciones.push(Validators.required);
    }
    if(llave=='area'){
      validaciones.push(Validators.required);
    }
    if(llave=='modulo'){
      validaciones.push(Validators.required);
    }
    return validaciones;
  }


 }
