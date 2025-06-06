import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = `${environment.apiEndpoint}`;

  constructor(private http: HttpClient) { }

  async getDatesByTournament(tournamentId: number): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(`${this.apiUrl}calendars/games-by-tournament/${tournamentId}/`)
    );
  }

  async getGamesByTournament(tournamentId: number): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(`${this.apiUrl}calendars/games-by-tournament/${tournamentId}`)
    );
  }

  async getGames(): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(`${this.apiUrl}calendars/games/`)
    );
  }
}
