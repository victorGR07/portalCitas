import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Apollo } from 'apollo-angular';
type AOA = any[][];
declare var saveAs: any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})

export class CreadorComponentesPDFService {
  constructor(private apollo?: Apollo) { }
  crearComprobanteCitaPrueba(cita,recomendaciones) {
    let imageurl;
    let logo = "../../../assets/images/logoAdministracion.jpeg"
    setTimeout(() => {
      imageurl = this.getBase64ImageFromURL(logo, cita,recomendaciones);
    }, 100);
  }

  getBase64ImageFromURL(url , cita , recomendaciones) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        this.crearComprobantePrueba(dataURL, cita , recomendaciones);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }


  crearComprobantePrueba(dataURL, cita , recomendaciones) {
    let nombre = '';
    let tipo_persona = 'Moral';
    if (cita.tipo_persona == 'F') {
      tipo_persona = 'Fisica';
      nombre = cita.nombre + ' ' + cita.primer_apellido;
      if (cita.segundo_apellido != undefined) {
        nombre = nombre + ' ' + cita.segundo_apellido;
      }
    }
    if(cita.tipo_persona == 'M'){
      nombre = cita.razon_social;
    }
    let nombre_tramite = cita.union_tramite_configuracion.tramite.nombre;
    var strcita = cita.fecha;
    var rescita = strcita.split("T");
    var rescitaaux = rescita[0].split("-");
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let vigencia = rescitaaux[2] + " de " + meses[parseInt(rescitaaux[1]) - 1] + " del " + rescitaaux[0];
    let diahora = cita.hora;
    var str = diahora;
    var res = str.split(":");
    let horacita = res[0] + ":" + res[1];
    let content = [
    ];
    let contador = 1;
    let mensajerequisitos = '';
    if(cita.union_tramite_configuracion.tramite.requisitos.requisitos!=undefined){
      for (var i = 0; i < cita.union_tramite_configuracion.tramite.requisitos.requisitos.length; i++) {
        if (i == 0) {
          content.push(
            {
              columns: [
                { width: '100%', alignment: 'center', text: 'Requisitos.', fontSize: 14, bold: true }
              ]
            }
          );
          contador = contador + 3;
        }
        let auxrequisitos = cita.union_tramite_configuracion.tramite.requisitos.requisitos[i];
        contador = contador + this.cuantasvecessalta(auxrequisitos.nombre_largo);

        const regex = /<br>/gi;
        let mensajerequisitos = auxrequisitos.nombre_largo.replace(regex, '\n');
        content.push({
          columns: [
            { width: 20, text: '' },
            { width: 490,alignment: 'justify', text: '•	' + mensajerequisitos, fontSize: 11, margin: [0, 10, 0, 0] }
          ]
        });
        if(contador>40){
          contador = 0;
          content.push({
            columns: [
              { width: 20, text: '',pageBreak: "after" },
             ]
          });
        }
      }
    }else{
      for (var i = 0; i < cita.union_tramite_configuracion.tramite.requisitos.length; i++) {
        if (i == 0) {
          content.push(
            {
              columns: [
                { width: '100%', alignment: 'center', text: 'Requisitos.', fontSize: 14, bold: true }
              ]
            }
          );
          contador = contador + 3;

        }
        let auxrequisitos = cita.union_tramite_configuracion.tramite.requisitos[i];
        const regex = /<br>/gi;
        contador = contador + this.cuantasvecessalta(auxrequisitos.nombre_largo);

        let mensajerequisitos = auxrequisitos.nombre_largo.replace(regex, '\n');
        content.push({
          columns: [
            { width: 20, text: '' },
            { width: 490, text: '•	' + mensajerequisitos, fontSize: 10, alignment: 'justify', margin: [0, 10, 0, 0] }
          ]
        });
        if(contador>40){
          contador = 0;
          content.push({
            columns: [
              { width: 20, text: '',pageBreak: "after" },
             ]
          });
        }
      }
    }



    let content2 = [
    ];

    for (var i = 0; i < recomendaciones.length; i++) {
      if(contador>40){
        contador = 0;
        content2.push({
          columns: [
            { width: 20, text: '',pageBreak: "after" },
           ]
        });
      }

      if (i == 0) {
        content.push(
          {
            columns: [
              { width: '100%', alignment: 'center', text: 'Recomendaciones.', fontSize: 14, bold: true }
            ]
          }
        );
        contador = contador + 3;

      }
      content2.push(
        {
          columns: [
            { width: 20, text: '' },
            { width: 490, alignment: 'justify', text: '•	' + recomendaciones[i].recomendacion, fontSize: 10 , margin: [0, 8, 0, 0] }
          ]
        },
      );
      contador = contador + this.cuantasvecessalta(recomendaciones[i].recomendacion);

    }




    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    }
    var dd = {
      pageSize: {
        width: 595.28,
        height: 1000
      },
      pageMargins: [40, 30, 40, 50],
   
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
        columns: [
      
        ]
      },
      content: [
         { image: dataURL, width: 271, height: 64, absolutePosition: { x: 170, y: 30 } },
      {
        columns: [
          {
            canvas: [
              {
                type: 'rect',
                x: 5,
                y: 95,
                w: 520,
                h: 39,
                color: '#f5f5f5',
              },
            ]
          },
        ]
      },
        {
          columns: [
          
          { width: '100%', alignment: 'center', text: ['CONFIRMACIÓN DE CITA PARA EL TRÁMITE ', { text: nombre_tramite.toUpperCase(), bold: true },' DE LA ADMINISTRACIÓN PÚBLICA ESTATAL DEL GOBIERNO DE OAXACA'] , fontSize: 14, margin: [0, -35, 0, 0] }
          ]
        },
        {
          columns: [
            { alignment: 'justify', text: [' '], margin: [0, 0, 0, 10] }
          ]
        },
        {
          columns: [
            { width: 20, text: '' },
            {
              width: 'auto',
              table: {
                widths: [ 220, 220 ],
                body: [
                  [
                    
                    { text: ['', { text: 'Fecha:', bold: true }, ' ' + vigencia] , fontSize: 11 },
                    { text: ['', { text: 'Hora:', bold: true }, ' ' + horacita], fontSize: 11 }
                  ],
                  [
                    
                    { text: ['', { text: 'Número de cita:', bold: true }, ' ' + cita.folio_dia], fontSize: 11 },
                    { text: ['', { text: 'Folio:', bold: true }, ' ' + cita.folio_general], fontSize: 11 }
                  ],
                  [
                    { text: ['', { text: 'Nombre del tramitante:', bold: true }, ' ' + nombre], fontSize: 11, colSpan: 2 }, {}

                  ],
                  [
                    
                    { text: ['', { text: 'Persona fisica o moral:', bold: true }, ' ' + tipo_persona],fontSize: 11 },
                    { text: ['', { text: 'RFC:', bold: true }, ' ' + cita.rfc], fontSize: 11 }
                  ],
                ]
              }
            },
            { width: '*', text: '' },
          ]
        },

        {
          columns: [
            { alignment: 'justify', text: [' '], margin: [0, 0, 0, 15] }
          ]
        },
        content,
        content2


      ]
    };
    pdfMake.createPdf(dd).download('cita.pdf');
  }

  cuantasvecessalta(palabra: any){
    let veces = 1;
    let tamaniopalabra = palabra.length;
    for(var i = 1; (i*90) < tamaniopalabra; i++){
      veces = veces + 1;
    }
    return veces;
  }

}
