import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Services
import { SessionStorageService } from '../../core/services/sessionstorage.service';


import {Apollo} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class CheckAuthGuard implements CanActivate {
  public user: any;

  constructor(
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private apollo?: Apollo,

  ) { }

  /**
   * @description Si existe una cuenta verificada redirecciona al path configurado
   * @see environment En environments vea el diccionario contentfulConfig
   */
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.user = JSON.parse(this.sessionStorageService.get('usuario'));
    if(this.user!=undefined){
      if(this.user.rol.nombre.toUpperCase() == 'ENCARGADO'){
        window.location.href = "/usuarios";
      }else{
        window.location.href = "/verificar";

      }
    }
    return true;
  }
}
