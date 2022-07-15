import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private sessionstorage: any;

  constructor() {
    this.sessionstorage = sessionStorage;
  }

  set(name: string, value: string): void {
    this.sessionstorage.setItem(name, value);
  }

  get(name: string): string {
    return this.sessionstorage.getItem(name);
  }

  remove(name: string): void {
    this.sessionstorage.removeItem(name);
  }

  clean(): void {
    this.sessionstorage.clear();
  }
}
