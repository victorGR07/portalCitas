import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {StorageService} from "../services/storage.service";

@Injectable()
export class AuthorizatedReporteGuard implements CanActivate {

  constructor(private router: Router,
              private storageService: StorageService) { }

  canActivate() {
     if (this.storageService.isAuthenticated()  && (this.storageService.getCurrentUser().id_rol == 4 || this.storageService.getCurrentUser().id_rol == 3 || this.storageService.getCurrentUser().id_rol == 2) ) {
      if(this.storageService.isExpired()){
        this.storageService.logout();
        window.location.href = "/login";
      }else{
        return true;
      }
    }
    window.location.href = "/login";
    return false;
  }
}
