import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {StorageService} from "../services/storage.service";

@Injectable()
export class TestAuthorizatedGuard implements CanActivate {

  constructor(private router: Router,
              private storageService: StorageService) { }

              canActivate() {
                if (this.storageService.isAuthenticated()) {
                  if(this.storageService.isExpired()){
                    this.storageService.logout();
                    window.location.href = "/login";
                  }
                  window.location.href = "/validacion";
                  return false;

                }
                 return true;
              }
}
