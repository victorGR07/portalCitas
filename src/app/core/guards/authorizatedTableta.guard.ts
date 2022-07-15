import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {StorageService} from "../services/storage.service";

@Injectable()
export class AuthorizatedTabletaGuard implements CanActivate {

  constructor(private router: Router,
              private storageService: StorageService) { }

  canActivate() {
    if (this.storageService.isAuthenticated() && this.storageService.getCurrentUser().id_rol == 7) {
      if(this.storageService.isExpired()){
        this.storageService.logout();
        window.location.href = "/login";
      }
       return true;
    }else{
      window.location.href = "/login";

     return false;
   }
 }
}
