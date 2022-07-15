import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  connection$ = new Subject<{status?: boolean, error?: Error}>();
  private storage: Storage;

  constructor() {         
    this.connetion();       
  }
  
  private connetion(): void {
    const support: string = "localstorage support testing!"; 
    this.storage = localStorage;          
    
    setTimeout(() => {
      try {
        localStorage.setItem(support, support); 
        localStorage.removeItem(support); 
        this.storage = localStorage;          
        this.connection$.next({status: true}); 
      } catch (error) {
        this.connection$.next({error: error}); 
      }      
    }, 0);
  }

  set(name: string, value: string): void {
    this.storage.setItem(name, value);
  }

  get(name: string): any {
    return this.storage.getItem(name); 
  }

  remove(name: string): void {
    this.storage.removeItem(name);
  }

  clear(): void {
    this.storage.clear();
  }
}