import {Injectable} from "@angular/core";
import {Session} from "../models/session.model";
import {User} from "../models/user.model";

@Injectable()
export class StorageService {

  private localStorageService;
  public currentSession : Session = null;
  private horaStorage:number = 0;
  private minutosStorage:number = 0;
  private segundosStorage:number = 0;
  private contador:any;
  private contador2:any;


  private horaStorage2:number = 0;
  private minutosStorage2:number = 0;
  private segundosStorage2:number = 0;
  public ippublic : any;
  public tokenService : any;

  constructor(
  //  private router: Router
  ) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
    this.ippublic = this.loadGetPublic();
    this.tokenService = this.loadGetToken();

  }




  isExpired(): boolean {
     var diaexpire= new Date(this.getCurrentSession().expire);

    let actual = new Date();

    return (diaexpire.getTime() < actual.getTime()) ? true : false;
  };

  loadGetPublic(){
    return this.getIpPublic();
  }


  loadGetToken(){
    return this.getTokensAccount();
  }



  getIpPublic(): any{
     return this.localStorageService.getItem('ipPublic');

  }


  getTokensAccount(): any{
     return this.localStorageService.getItem('X-Token-Account'); 
  }

  starCronometro(): void {
    if(this.contador == undefined) {
      this.contador = setInterval(()=> {

          this.segundosStorage += 1;
          if (this.segundosStorage == 60) {
            this.segundosStorage = 0;
            this.minutosStorage += 1;
            if (this.minutosStorage == 60) {
              this.minutosStorage = 0;
              this.horaStorage += 1;
              if (this.horaStorage = 24) {
                this.horaStorage = 0;
              }
            }
          }

          this.localStorageService.setItem('second', this.segundosStorage);
          this.localStorageService.setItem('minute', this.minutosStorage);
          this.localStorageService.setItem('hour', this.horaStorage);

        }, 1000);
      }
  }


  reiniciarCronometro(): void {
    this.segundosStorage = 0;
    this.minutosStorage= 0;
    this.horaStorage= 0;
    this.segundosStorage2 = 0;
    this.minutosStorage2= 0;
    this.localStorageService.setItem('second', this.segundosStorage);
    this.localStorageService.setItem('minute', this.minutosStorage);
    this.localStorageService.setItem('hour', this.horaStorage);
    this.localStorageService.setItem('minute2', this.minutosStorage2);
    this.localStorageService.setItem('second2', this.segundosStorage2);
  }


  getSecond(): any{
    return this.localStorageService.getItem('second');

  }

  getMinute(): any{
    return this.localStorageService.getItem('minute');

  }
  getHour(): any{
    return this.localStorageService.getItem('hour');

  }


  startRegresivo() {
    if(this.contador2 == undefined) {
      this.contador2 = setInterval(()=> {
         if (this.segundosStorage2 > 0 && this.segundosStorage2 <= 60) {
          this.segundosStorage2--;

        } else {
          if (this.minutosStorage2 > 0 && this.minutosStorage2 <= 60) {
             this.minutosStorage2--;
            this.segundosStorage2 = 59;

           }
        }
        this.localStorageService.setItem('minute2', this.minutosStorage2);
        this.localStorageService.setItem('second2', this.segundosStorage2);


      }, 1000);
    }
  }

  getSecond2(): any{
    return this.localStorageService.getItem('second2');

  }

  getMinute2(): any{
    return this.localStorageService.getItem('minute2');

  }

  setMinute2(minute: any){
    this.minutosStorage2 =  minute;

  }

  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
  }

  loadSessionData(): Session{
    var sessionStr = this.localStorageService.getItem('currentUser');
    return (sessionStr) ? <Session> JSON.parse(sessionStr) : null;
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }

  getCurrentUser(): User {
    var session: Session = this.getCurrentSession();
    return (session && session.user) ? session.user : null;
  };

  isAuthenticated(): boolean {
    return (this.getCurrentToken() != null) ? true : false;
  };

  getCurrentToken(): string {
    var session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  };

  getRole(): string {
    var session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  };

  logout(): void{
    this.removeCurrentSession();
  }

  setIpPublic(ip: any): void {
     this.localStorageService.setItem('ipPublic', ip.ip);
  }

}
