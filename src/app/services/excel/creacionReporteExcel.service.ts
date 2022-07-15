import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
type AOA = any[][];

@Injectable({
  providedIn: 'root'
})
export class CreadorReporteExcel {
   dataexcel: AOA = [ ];
  title = 'Reporte';
  excel=[];
  constructor() { }

  generarexcel(arrayCitas: any, usuario: any, tramite: any, tipo_persona: any, estado: any, fecha_intervalo: any){

    let meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

    let diaActual = new Date();
    let fecha =  diaActual.getDate()  + ' DE '+ meses[diaActual.getMonth()].toUpperCase() +' DEL ' + diaActual.getFullYear()
    let datosexcel = [];
    let minutos = "";
    if(diaActual.getMinutes() < 10){
        minutos = "0" + diaActual.getMinutes();
    }else{
        minutos = "" + diaActual.getMinutes();
    }
    datosexcel.push([]);
    datosexcel.push(['Secretaría de Administración','','','SISTEMA DE CITAS A PROVEEDORES']);

    datosexcel.push(['Gobierno del Estado de Oaxaca']);
    datosexcel.push([]);
    datosexcel.push([]);
    if(usuario!=undefined){
      let nombre_persona = usuario.nombre + ' ' + usuario.primer_apellido;
      if(usuario.segundo_apellido!=undefined){
        nombre_persona = nombre_persona + ' ' + usuario.segundo_apellido;
      }
      datosexcel.push(['Usuario:',nombre_persona]);
    }else{
      datosexcel.push(['Usuario:','Todos']);

    }
    if(tramite!=undefined){
      datosexcel.push(['Trámite:',tramite.label]);
    }else{
      datosexcel.push(['Trámite:','Todos']);

    }
    if(tipo_persona!=undefined){
      datosexcel.push(['Tipo de Persona:',tipo_persona.nombre]);
    }else{
      datosexcel.push(['Tipo de Persona:','Todos']);

    }
    if(estado!=undefined){
      datosexcel.push(['Estado:',estado.nombre]);
    }else{
      datosexcel.push(['Estado:','Todos']);

    }
    datosexcel.push(['CITAS DEL INTERVALO DE TIEMPO DEL  ' + fecha_intervalo]);


    let descripcionrequisito = '';

       for(var i = 0; i < arrayCitas.length; i++){
         descripcionrequisito = '';
         for(var x = 0; x < arrayCitas[i].documentacionfaltante.length;x++){
           if(x == 0){
             descripcionrequisito = '';
           }
           if(!arrayCitas[i].documentacionfaltante[x].valor){
             descripcionrequisito = descripcionrequisito + arrayCitas[i].documentacionfaltante[x].nombre + ' \n' ;
           }
          }
        if(i == 0){
          datosexcel.push(['N°','Folio','N° Cita','Nombre','Trámite','Tipo Persona' ,'Fecha','Hora','Estatus','Comentario','Requisitos Faltantes','Atendido por','Trámite Confirmación','Teléfono','Correo']);
        }
        datosexcel.push([ (i+1),arrayCitas[i].folio,arrayCitas[i].numero_cita,arrayCitas[i].nombre,arrayCitas[i].tramite,arrayCitas[i].tipo_persona, arrayCitas[i].fecha,arrayCitas[i].hora,arrayCitas[i].estado,arrayCitas[i].observacion,descripcionrequisito,arrayCitas[i].usuario,arrayCitas[i].nombretramiteconfirmacion, arrayCitas[i].telefono, arrayCitas[i].email ]);

      }







      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(datosexcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

   XLSX.writeFile(wb, 'ReporteDeCitas_' + fecha+'.xlsx');

  }


}
