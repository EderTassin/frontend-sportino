import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  async createTournament(data: any): Promise<any> {
    return await firstValueFrom(this.http.post(`${this.apiUrl}calendars/tournament/`, data));
  }

  addDates(tournamentId: string, dates: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/tournaments/${tournamentId}/dates`, { dates });
  }

  addMatches(tournamentId: string, matches: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/tournaments/${tournamentId}/matches`, { matches });
  }
}