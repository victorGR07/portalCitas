import { NgModule } from '@angular/core';
import {StorageService} from "./services/storage.service";
import { AuthService } from './auth.service';
import {AuthorizatedAfterLoginGuard} from "./guards/authorizatedafterlogin.guard";
import {AuthorizatedGuard} from "./guards/authorizated.guard";
import {TestAuthorizatedGuard} from "./guards/test.guard";
import {AuthorizatedVerificacionGuard} from "./guards/authorizatedVerificacion.guard";

import {AuthorizatedTabletaGuard} from "./guards/authorizatedTableta.guard";
import {AuthorizatedConfiguracionGuard} from "./guards/authorizatedConfiguracion.guard";
import {AuthorizatedReporteGuard} from "./guards/authorizatedReporte.guard";

@NgModule({
  providers: [
  
    AuthService,
  
    StorageService,
    AuthorizatedAfterLoginGuard,
    AuthorizatedVerificacionGuard,
    AuthorizatedTabletaGuard,
    AuthorizatedGuard,
    TestAuthorizatedGuard,
    AuthorizatedConfiguracionGuard,
    AuthorizatedReporteGuard
  ]
})
export class CoreModule {}
