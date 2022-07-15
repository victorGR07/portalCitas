import { Injectable } from '@angular/core'; 
import { hash } from 'sha-256';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public readonly RegExpEmail: RegExp = /^['']{0}$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  URLRedirect: string | null = null; 

  hashing(payload: string): string {    
    return hash(payload);    
  }
}