import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Tournament {
  id: number;
  name: string;
  date_from: string;
  date_to: string;
  active: boolean;
  image: string;
  category: number[];
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticaPartidosService {
  private url = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<any>{
    console.log('Error:', error)
    throw error;
  }

  async getPosiciones(tournament: number, category?: string) {
    const url = `${this.url}calendars/board/?tournament=${tournament}`;
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

  async getTournament(): Promise<Tournament[]> {
    const url = `${this.url}calendars/tournament/`;
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

  async getCalendarsWidgets(id?: number, date?: Date) {

    let url = `${this.url}calendars/widgets`;

    if (id) {
      url+=`/?tournament=${id}`
    }
    if (date) {
      url+=`&?date=${id}`  
    }

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

  async getDatesTournaments() {
    const url = `${this.url}calendars/dates/`;
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
