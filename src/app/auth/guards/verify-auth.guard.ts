import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Services
import { UtilsService } from '../utils/utils.service';
import { AccountService } from '../autentication.service';
import { SessionStorageService } from '../../core/services/sessionstorage.service';


import * as A from '../../graphql/queries';

import {Apollo} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class VerifyAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private utils: UtilsService,
    private account: AccountService,
    private apollo?: Apollo,

  ) { }

  /**
   * @description Si existe una cuenta procede a la ruta, de lo contrario redirecciona a la autenticación
   * @param next
   * @param state
   */
  user: any;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.utils.URLRedirect = state.url;
    this.user = JSON.parse(this.sessionStorageService.get('usuario'));
    if (this.user != undefined) {
      if(this.user.rol.nombre.toUpperCase() == 'OPERADOR'){
        let date1 = new Date(2022,5,1);
        let date2 = new Date();
        date2.setDate(date2.getDate()  - 1);
        this.apollo.use('backproveedores').watchQuery({
          query: A.GET_REPORTE_CITAS,
          variables: {
            fecha_inicio: date1,
            fecha_fin: date2,
            id_estado: 1

          }, fetchPolicy: 'no-cache'
        })
          .valueChanges.subscribe(result => {
            return this.asignarDatosCitas(result);
          }, (error) => {
            return false;
           });
              return true;
      }else{
        return true;

      }


     } else {
      let ruta = "/";
      this.sessionStorageService.clean();
      window.location.href = "/login";
    }
  }

  asignarDatosCitas(data): boolean{
    if(data.data.reportesCitas.length>0){
        window.location.href = "/pendientes";
    }else{
      return true;

    }
   }

}
