import { Injectable } from '@angular/core';
import {IMAGE} from "../../core/key/imglogo";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
type AOA = any[][];
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})
export class CreadorComponentesPDFReportesService {
  meses: any = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

  constructor() { }

descargarPadronConcesionariosXMunicipio(entidad: any, array: any,nombreOrigenEntidad: any,tipoDocumento: any,tipodecita: any){

  let movimiento = 0;
  if( tipodecita == 'CITAS ACTIVAS'){
    movimiento = -570;
  }else{
    movimiento = -580;

  }
  let tipoMostrado = '';
  if(tipoDocumento == 'Vencidos'){
    tipoMostrado = '(VENCIDOS)';
  }
  let diaActual = new Date();
  let fecha =  diaActual.getDate()  + ' DE '+ this.meses[diaActual.getMonth()].toUpperCase() +' DEL ' + diaActual.getFullYear();
  let minutos = "";
  if(diaActual.getMinutes() < 10){
      minutos = "0" + diaActual.getMinutes();
  }else{
      minutos = "" + diaActual.getMinutes();
  }
  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  }
  let content_array = [];

  if(nombreOrigenEntidad=='Todos los Módulos'){
    content_array.push(this.getDatosTablaReporteLocalidadTodos(array));

  }else{
    content_array.push(this.getDatosTablaReporteLocalidad(array));

  }
   var dd = {
    pageSize: 'LEGAL',
    pageOrientation: 'landscape',
    pageMargins: [ 15, 140, 20, 40 ],
    background:{ columns: [
      { width: 700,text: ''},
      { image: 'data:image/jpeg;base64,'+IMAGE.IMAGE_B,width: 256,height: 60, margin: [0, 20, 0, 60]},
    ]
  },
        footer: function(currentPage, pageCount) {
    return {
       margin:10,
       columns: [
       {
           fontSize: 9,
           text:[
           {
           text: '--------------------------------------------------------------------------' +
           '\n',
           margin: [0, 25]
           },
           {
           text: currentPage.toString() + ' de ' + pageCount,
           }
           ],
           alignment: 'center'
         }
       ]
     };
    },
  header: {
    margin: 10,
    columns: [
      {
        margin: [40, 10, 0, 0],
        width: '100%' ,text:[ 'Secretaría de Administración ' ], fontSize: 14,bold: true,
      },
      { columns: [
        {
          margin: [-600, 10, 0, 0],
           width: '300%' ,text: 'SISTEMA DE CITAS ', fontSize: 18,bold: true  }
        ]
      },
      { columns: [
        {
          margin: [movimiento, 30, 0, 0],
           width: '200%' ,text:tipodecita, fontSize: 13,bold: true  }
        ]
      },
      { columns: [
        {
          margin: [-898, 78, 0, 0],
          width: '100%' ,text: '  ÁREA:' + entidad , fontSize: 13,bold: true
        },

        ]
      },
      { columns: [
        {
          margin: [-898, 92, 0, 0],
          width: '100%' ,text: ' MÓDULO:' + nombreOrigenEntidad , fontSize: 13,bold: true
        },

        ]
      },
      { columns: [
        {
          margin: [-898, 108, 0, 0],
          width: '100%' ,text: 'REPORTE GENERADO:'+fecha + " " + diaActual.getHours()+":"+minutos, fontSize: 13,bold: true
        },

        ]
      },
      { columns: [
        {
          margin: [-420, 108, 0, 0],
          width: '100%' ,text:  tipoDocumento, fontSize: 13,bold: true
        },

        ]
      },

    ]
  },
  content: content_array
  };
   pdfMake.createPdf(dd).download('ReporteDeCitas.pdf');
}

getDatosTablaReporteLocalidad(array: any){

    let arrayParaTabla = [];

    for(var i = 0; i < array.length; i++){
      if(i == 0){
        arrayParaTabla.push(
          [ {text: 'No.', fontSize:9, bold: true,alignment: 'center' } ,
          {text: 'Folio', fontSize:9, bold: true,alignment: 'center' } ,
          { text: 'Nombre', fontSize:9, bold: true,alignment: 'center' }  ,
          { text: 'Primer Apellido', fontSize:9, bold: true,alignment: 'center' } ,
          { text: 'Segundo Apellido', fontSize:9, bold: true,alignment: 'center' } ,
          { text: 'Teléfono', fontSize:9, bold: true,alignment: 'center' } ,
          { text: 'Trámite', fontSize:9, bold: true,alignment: 'center' } ,
          { text: 'Día', fontSize:9, bold: true,alignment: 'center' } ,

          { text: 'Hora', fontSize:9 , bold: true,alignment: 'center'}

        ]
      );
    }
    arrayParaTabla.push(
      [ {text: (i+1), fontSize:7,alignment: 'center' } ,
      {text: array[i].folio, fontSize:7} ,
      { text: array[i].nombre, fontSize:7}  ,
      { text: array[i].primer_apellido, fontSize:7  } ,
      { text: array[i].segundo_apellido, fontSize:7 },
      { text: array[i].telefono, fontSize:7,alignment: 'center' },
      { text: array[i].tramite, fontSize:7,alignment: 'center' } ,
       { text: array[i].fecha, fontSize:7,alignment: 'center' }   ,
       { text: array[i].hora, fontSize:7,alignment: 'center' }   ,


         ]
    );

    }
    let datosTablaReporteLocalidad =
              {
                style: 'tableExample',
                table: {
                headerRows: 1,
                widths: [ '3%','13%', '15%', '15%','15%','9%', '15%','7%','7%' ],
                body:  arrayParaTabla,
              },
    			layout: {
    				fillColor: function (rowIndex, node, columnIndex) {
    					return (rowIndex === 0) ? '#CCCCCC' : null;
    				},
            hLineWidth: function (i, node) {
    					return (i === 0 || i === node.table.body.length) ? 2 : 1;
    				},
    				vLineWidth: function (i, node) {
    					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
    				},
    				hLineColor: function (i, node) {
    					return (i === 0 || i === node.table.body.length) ? 'white' : 'white';
    				},
    				vLineColor: function (i, node) {
    					return (i === 0 || i === node.table.widths.length) ? 'white' : 'white';
    				},
    			}
       };
      return datosTablaReporteLocalidad;
    }

    cuantasvecessalta(palabra: any,limit: any){
      let veces = 1;
      let tamaniopalabra = palabra.length;
      for(var i = 1; (i*limit) < tamaniopalabra; i++){
        veces = veces + 1;
      }
      return veces;
    }

    getDatosTablaReporteLocalidadTodos(array: any){

        let arrayParaTabla = [];

        for(var i = 0; i < array.length; i++){
          if(i == 0){
            arrayParaTabla.push(
              [ {text: 'No.', fontSize:9, bold: true,alignment: 'center' } ,
              {text: 'Folio', fontSize:9, bold: true,alignment: 'center' } ,
              { text: 'Nombre', fontSize:9, bold: true,alignment: 'center' }  ,
              { text: 'Primer Apellido', fontSize:9, bold: true,alignment: 'center' } ,
              { text: 'Segundo Apellido', fontSize:9, bold: true,alignment: 'center' } ,
              { text: 'Teléfono', fontSize:9, bold: true,alignment: 'center' } ,
              { text: 'Trámite', fontSize:9, bold: true,alignment: 'center' } ,
              { text: 'Día', fontSize:9, bold: true,alignment: 'center' } ,

              { text: 'Hora', fontSize:9 , bold: true,alignment: 'center'},
              { text: 'Módulo', fontSize:9 , bold: true,alignment: 'center'}

            ]
          );
        }
        arrayParaTabla.push(
          [ {text: (i+1), fontSize:7,alignment: 'center' } ,
          {text: array[i].folio, fontSize:7} ,
          { text: array[i].nombre, fontSize:7}  ,
          { text: array[i].primer_apellido, fontSize:7  } ,
          { text: array[i].segundo_apellido, fontSize:7 },
          { text: array[i].telefono, fontSize:7,alignment: 'center' },
          { text: array[i].tramite, fontSize:7,alignment: 'center' } ,
           { text: array[i].fecha, fontSize:7,alignment: 'center' }   ,
           { text: array[i].hora, fontSize:7,alignment: 'center' }   ,
           { text: array[i].modulo, fontSize:7,alignment: 'center' }   ,


             ]
        );

        }
        let datosTablaReporteLocalidad =
                  {
                    style: 'tableExample',
                    table: {
                    headerRows: 1,
                    widths: [ '3%','10%', '12%', '12%','15%','9%', '15%','7%','7%','7%' ],
                    body:  arrayParaTabla,
                  },
        			layout: {
        				fillColor: function (rowIndex, node, columnIndex) {
        					return (rowIndex === 0) ? '#CCCCCC' : null;
        				},
                hLineWidth: function (i, node) {
        					return (i === 0 || i === node.table.body.length) ? 2 : 1;
        				},
        				vLineWidth: function (i, node) {
        					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        				},
        				hLineColor: function (i, node) {
        					return (i === 0 || i === node.table.body.length) ? 'white' : 'white';
        				},
        				vLineColor: function (i, node) {
        					return (i === 0 || i === node.table.widths.length) ? 'white' : 'white';
        				},
        			}
           };
          return datosTablaReporteLocalidad;
        }



}
