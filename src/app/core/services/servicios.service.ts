import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';

// Services
import { AccountService } from '../../auth/autentication.service';


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
 
  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}


}
