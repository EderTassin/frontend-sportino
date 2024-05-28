import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticaPartidosService {

  url: string = "/api/";

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<any>{
    console.log('Error:', error)
    throw error;
  }

  async getPosiciones(category: string) {
    const url = `${this.url}calendars/board/?tournament=39&category=${category}`;
    const headers = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await firstValueFrom(
      this.http.get(url, headers).pipe(
        catchError(this.handleError)
      )
    );
    return res;
  }

}
