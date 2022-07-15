import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Services
import { UtilsService } from '../utils/utils.service';
import { AccountService } from '../autentication.service';
import { SessionStorageService } from '../../core/services/sessionstorage.service';



@Injectable({
  providedIn: 'root'
})
export class VerifyEncargadoGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private utils: UtilsService,
    private account: AccountService
  ) {}

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
      if(this.user.rol.nombre.toUpperCase() == 'ENCARGADO'){
        return true;
      }else{
        window.location.href = "/shared";

      }

     } else {
      let ruta = "/";
      this.sessionStorageService.clean();
      window.location.href = "/login";
    }


  }

}
