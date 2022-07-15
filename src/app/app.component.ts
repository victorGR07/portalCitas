import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from './core/services/sessionstorage.service';
import { AccountService } from './auth/autentication.service';

 declare var M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit  {
  logged: boolean = false;
   loged: boolean = false;
   operador: boolean = false;
   encargado: boolean = false;

  public user: any;

  constructor(
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService,
  ) {}

  ngOnInit() {
      this.user = JSON.parse(this.sessionStorageService.get('usuario'));
      if(this.user!=undefined){
        this.loged = true;
        if(this.user.rol.nombre.toUpperCase() == 'ENCARGADO'){
          this.encargado = true;

        }
        if(this.user.rol.nombre.toUpperCase() == 'OPERADOR'){
          this.operador = true;

        }
       }

      setTimeout(() => {
        (<any>$(".dropdown-trigger")).dropdown();
        (<any>$(".sidenav")).sidenav();
     }, 100);



  }

  logout(){
    let ruta = "/";
     this.sessionStorageService.clean();
    window.location.href = ruta;
  }



}
