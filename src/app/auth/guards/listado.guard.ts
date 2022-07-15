import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Services
import { AccountService } from '../autentication.service';
import { ServiciosService } from '../../core/services/servicios.service';
import { SessionStorageService } from '../../core/services/sessionstorage.service';



@Injectable({
  providedIn: 'root'
})
export class ListadoGuard implements CanActivate {
  constructor(
    private router: Router,
    private account: AccountService,
    private serviciosService: ServiciosService,
    private sessionStorageService: SessionStorageService,

  ) { }

  /**
   * @description Si existe una cuenta verificada redirecciona al path configurado
   * @see environment En environments vea el diccionario contentfulConfig
   */
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let user = JSON.parse(this.sessionStorageService.get('usuario'));
    if(this.account.isLoggetIn()) {
      return true;
    }else{
      window.location.href = "/login";

    }

   }

}
