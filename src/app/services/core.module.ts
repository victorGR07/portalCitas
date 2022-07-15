import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CreadorComponentesPDFService} from "./pdfmake/creacionComponentes.service";
import {CreadorReporteExcel} from "./excel/creacionReporteExcel.service";
import {CreadorComponentesPDFReportesService} from "./pdfmake/creacionComponentesReportes.service";

 @NgModule({
  declarations: [  ],
  imports: [],
  providers: [
    CreadorComponentesPDFService,
    CreadorComponentesPDFReportesService,
    CreadorReporteExcel
   ],
  bootstrap: []
})
export class CorePDFModule {
  constructor (@Optional() @SkipSelf() parentModule: CorePDFModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
