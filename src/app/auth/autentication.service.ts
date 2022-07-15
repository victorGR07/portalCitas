import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

/**
 * NOTA!
 * Es importante que en los servicios se tenga un servicio de localstorage
 * Es importante recordar que para el manejo de fechas se utiliza moment
*/


// Services
import { LocalstorageService } from '../core/services/localstorage.service';

// Models
import { AccountItem } from '../core/models/account.model';
import { Router } from '@angular/router';

// Variables
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class AccountService {
   private readonly X_TOKEN_ACCOUNT: string = "X-Token-Account";
  private readonly X_REFRESH_TOKEN_ACCOUNT: string = "X-RefreshToken-Account";
  private readonly expiresIn: string = "expiresIn";

  constructor(
    private localstorage: LocalstorageService,
    private http: HttpClient,
    private router: Router
  ) { }



  private save(payload: AccountItem): void {
    this.localstorage.set(this.X_TOKEN_ACCOUNT, payload.X_TOKEN_ACCOUNT);
    this.localstorage.set(this.X_REFRESH_TOKEN_ACCOUNT, payload.X_REFRESH_TOKEN_ACCOUNT);
    this.localstorage.set(this.expiresIn, new String(payload.expiresIn).valueOf());
  }

  isLoggetIn(): boolean {
    if(this.getTokensAccount) {
      if(moment().utc(true).isBefore(this.getTokensAccount.expiresIn)) {
        return true;
      } else {
        this.clear();
      }
    }
    return false;
  }

  public logout(): void {
    this.clear();
  }

  get getTokensAccount(): AccountItem | undefined {
    const RefreshToken = this.getRefreshToken;
    const ExpiresIn = this.getExpiresIn;
    const Token = this.getToken;

    if(!RefreshToken || !ExpiresIn || !Token) {
      this.clear();
      return undefined;
    }

    return {
      X_TOKEN_ACCOUNT: Token,
      X_REFRESH_TOKEN_ACCOUNT: RefreshToken,
      expiresIn : ExpiresIn
    }
  }

  private clear(): void {
    this.localstorage.remove(this.X_TOKEN_ACCOUNT);
    this.localstorage.remove(this.X_REFRESH_TOKEN_ACCOUNT);
    this.localstorage.remove(this.expiresIn);
  }

  private get getToken(): string | undefined {
    const data = this.localstorage.get(this.X_TOKEN_ACCOUNT);
    return data ? new String(data).valueOf() : undefined;
  }

  private get getRefreshToken(): string | undefined {
    const data = this.localstorage.get(this.X_REFRESH_TOKEN_ACCOUNT);
    return data ? new String(data).valueOf() : undefined;
  }

  private get getExpiresIn(): Date | undefined {
    const data = this.localstorage.get(this.expiresIn);
    return data ? data : undefined;
  }

  getTokenObject(){
    const RefreshToken = this.getRefreshToken;
    const ExpiresIn = this.getExpiresIn;
    const Token = this.getToken;

    return {
      X_TOKEN_ACCOUNT: Token,
      X_REFRESH_TOKEN_ACCOUNT: RefreshToken,
      expiresIn : ExpiresIn
    }
  }
}
