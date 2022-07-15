import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertNSService {

  constructor() { }

  public convert(num: number): string {
    return this.numeroALetras(num);
  }

  unidades(num){
    switch(num)
    {
      case 1: return "UN";
      case 2: return "DOS";
      case 3: return "TRES";
      case 4: return "CUATRO";
      case 5: return "CINCO";
      case 6: return "SEIS";
      case 7: return "SIETE";
      case 8: return "OCHO";
      case 9: return "NUEVE";
    }
    return "";
  }
  decenas(num){
    let decena = Math.floor(num/10);
    let unidad = num - (decena * 10);
    switch(decena)
    {
      case 1:
      switch(unidad)
      {
        case 0: return 'DIEZ';
        case 1: return 'ONCE';
        case 2: return 'DOCE';
        case 3: return 'TRECE';
        case 4: return 'CATORCE';
        case 5: return 'QUINCE';
        default: return 'DIECI' + this.unidades(unidad);
      }
      case 2:
      switch(unidad)
      {
        case 0: return 'VEINTE';
        default: return 'VEINTI' + this.unidades(unidad);
      }
      case 3: return this.decenasY('TREINTA', unidad);
      case 4: return this.decenasY('CUARENTA', unidad);
      case 5: return this.decenasY('CINCUENTA', unidad);
      case 6: return this.decenasY('SESENTA', unidad);
      case 7: return this.decenasY('SETENTA', unidad);
      case 8: return this.decenasY('OCHENTA', unidad);
      case 9: return this.decenasY('NOVENTA', unidad);
      case 0: return this.unidades(unidad);
    }
  }//Unidades()
  decenasY(strSin, numUnidades) {
    if (numUnidades > 0)
    return strSin + ' Y ' + this.unidades(numUnidades)

    return strSin;
  }//DecenasY()
  centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);
    switch(centenas)
    {
      case 1:
      if (decenas > 0){
      return 'CIENTO ' + this.decenas(decenas);}else{
        return 'CIEN';

      }
      case 2: return 'DOSCIENTOS ' + this.decenas(decenas);
      case 3: return 'TRESCIENTOS ' + this.decenas(decenas);
      case 4: return 'CUATROCIENTOS ' + this.decenas(decenas);
      case 5: return 'QUINIENTOS ' + this.decenas(decenas);
      case 6: return 'SEISCIENTOS ' + this.decenas(decenas);
      case 7: return 'SETECIENTOS ' + this.decenas(decenas);
      case 8: return 'OCHOCIENTOS ' + this.decenas(decenas);
      case 9: return 'NOVECIENTOS ' + this.decenas(decenas);
    }
  }
  seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)
    let letras = '';
    if (cientos > 0){
      if (cientos > 1)
      {
        letras = this.unidades(cientos) + ' ' + strPlural;
      }
      else
      {
        letras = strSingular;
      }
    }
    if (resto > 0)
    {
      letras += '';
    }
    return letras;
  }//Seccion()
  miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)
    let strMiles = this.seccion(num, divisor, 'MIL', 'MIL');
    let strCentenas;
    if(resto >= 100){
      strCentenas = this.centenas(resto);
    }else{
      if(resto >= 10){
        strCentenas = this.decenas(resto);
      }else{
        strCentenas = this.unidades(resto);
      }
    }
    if(strMiles == '')
    return strCentenas;

    return strMiles + ' ' + strCentenas;
  }//Miles()
  numeroALetras(num){
    var data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: "",
      letrasMonedaPlural: "PESOS",
      letrasMonedaSingular: "PESO"
    };
    if (data.centavos > 0)
    data.letrasCentavos = "CON " + data.centavos + " CENTAVOS";

    if(data.enteros == 0)
    return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
    return this.miles(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
    return this.miles(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
  }
}
