export class ValidatorForm {

  static passwordValidator(nombre): any {
      if (nombre.pristine) {
        return null;
     }   const NOMBRE_REGEXP = /^(?=(?:.*(\d|[$@])){1})(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})\S{8,}$/g;  nombre.markAsTouched();   if (NOMBRE_REGEXP.test(nombre.value)) {
         return null;
     }   return {
        invalidTexto: true
     };
    }
  // Validates numbers
static numberValidator(number): any {
   if (number.pristine) {
      return null;
   }   const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;   number.markAsTouched();   if (NUMBER_REGEXP.test(number.value)) {
      return null;
   }   return {
      invalidNumber: true
   };
  }

  static telefonoValidator(number): any {
      if (number.pristine) {
        return null;
     }   const NUMBER_REGEXP = /^[0-9]{10}/;   number.markAsTouched();   if (NUMBER_REGEXP.test(number.value)) {
        return null;
     }   return {
        invalidNumber: true
     };
    }


  static correoValidator(correo): any {
     if (correo.pristine) {
        return null;
     }   const EMAIL_REGEXP = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
     correo.markAsTouched();
     if (EMAIL_REGEXP.test(correo.value)) {
        return null;
     }   return {
        invalidEmail: true
     };
    }


  static nucValidator(nuc): any {
     if (nuc.pristine) {
        return null;
     }
     const NUC_REGEXP = /[a-zA-Z0-9]*\-[a-zA-Z0-9]*\/[a-zA-Z0-9]*\-[a-zA-Z0-9]*\-[a-zA-Z0-9]*/;
     nuc.markAsTouched();
     if (NUC_REGEXP.test(nuc.value)) {
        return null;
     }   return {
        invalidNUC: true
     };
    }


  static curpValidator(curp): any {
     if (curp.pristine) {
        return null;
     }   const CURP_REGEXP = /^[a-zA-ZñÑ]{4}[0-9]{6}[a-zA-ZñÑ]{6}[0-9]{2}$/;   curp.markAsTouched();   if (CURP_REGEXP.test(curp.value)) {
        return null;
     }   return {
        invalidCCURP: true
     };
    }

    static rfcValidator(rfc): any {

       if (rfc.pristine) {
          return null;
       }   const RFC_REGEXP = /^([A-Z&Ññ]{3}|[A-Z][AEIOU][A-Z]{2})\d{2}((01|03|05|07|08|10|12)(0[1-9]|[12]\d|3[01])|02(0[1-9]|[12]\d)|(04|06|09|11)(0[1-9]|[12]\d|30))([A-Z0-9]{2}[0-9A])$/;   rfc.markAsTouched();   if (RFC_REGEXP.test(rfc.value)) {
          return null;
       }   return {
          invalidRFC: true
       };
      }


      static municipioValidator(municipio): any {
        if (municipio.pristine) {
           return null;
        }
        municipio.markAsTouched();
        if(municipio.arreglo!=undefined){
          if (municipio.arreglo.includes(municipio.value)) {
             return null;
          }   return {
             invalidMunicipio: true
          };
        }else{
          return {
             invalidMunicipio: true
          };
        }

      }


      static localidadValidator(localidad): any {
        if (localidad.pristine) {
           return null;
        }
         localidad.markAsTouched();
        if(localidad.arreglo!=undefined){
          if (localidad.arreglo.includes(localidad.value)) {
             return null;
          }   return {
             invalidLocalidad: true
          };
        }else{
          return {
            invalidLocalidad: true
          };
        }

      }

      static agenciaValidator(agencia): any {
        if (agencia.pristine) {
           return null;
        }
        agencia.markAsTouched();
        if(agencia.arreglo!=undefined){
          if (agencia.arreglo.includes(agencia.value)) {
             return null;
          }   return {
             invalidAgencia: true
          };
        }else{
          return {
            invalidAgencia: true
          };
        }

      }


      static tipoVialidadValidator(tipoVialidad): any {
        if (tipoVialidad.pristine) {
           return null;
        }
        tipoVialidad.markAsTouched();
        if(tipoVialidad.arreglo!=undefined){
          if (tipoVialidad.arreglo.includes(tipoVialidad.value)) {
             return null;
          }   return {
             invalidTipoVialidad: true
          };
        }else{
          return {
            invalidTipoVialidad: true
          };
        }

      }


      static tipoAsentamientoValidator(tipoAsentamiento): any {
        if (tipoAsentamiento.pristine) {
           return null;
        }
        tipoAsentamiento.markAsTouched();
        if(tipoAsentamiento.arreglo!=undefined){
          if (tipoAsentamiento.arreglo.includes(tipoAsentamiento.value)) {
             return null;
          }   return {
             invalidTipoAsentamiento: true
          };
        }else{
          return {
            invalidTipoAsentamiento: true
          };
        }

      }


}
