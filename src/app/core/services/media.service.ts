import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// Variables
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly WebServiceURI: string = `${environment.URIRecursos}`;

  constructor(
    private http: HttpClient
  ) {}

  getMedias(): Observable<any> {
     return this.http.get(`${this.WebServiceURI}/media/`);
  }


  getFirmas(): Observable<any> {
     return this.http.get(`${this.WebServiceURI}/firmas/`);
  }

  deleteImage(image): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let body=JSON.stringify(image);

  return this.http.post<any>(`${this.WebServiceURI}/delete/`, body, {headers: headers} );
  }

  deleteFirma(image): Observable<any> {
  return this.http.post<any>(`${this.WebServiceURI}/deletefirma/`, image );
  }

}
