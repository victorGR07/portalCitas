import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {StorageService} from "../services/storage.service";

@Injectable()
export class AuthorizatedAfterLoginGuard implements CanActivate {

  constructor(private router: Router,
              private storageService: StorageService) { }

  canActivate() {
    if (this.storageService.isAuthenticated()) {
      if(this.storageService.isExpired()){
        this.storageService.logout();
        window.location.href = "/login";
      }
      if(this.storageService.getCurrentUser().id_rol == 7){
         window.location.href = "/examentableta";
        return true;

      }else{
         window.location.href = "/validacion";
        return true;

      }
     }else{
     return true;
   }
 }
}
