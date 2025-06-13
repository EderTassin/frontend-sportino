import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { firstValueFrom, lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TournamentService {
  private apiUrl = `${environment.apiEndpoint}`;

  constructor(private http: HttpClient) {}

  async getDatesByTournament(tournamentId: number): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(
        `${this.apiUrl}calendars/tournament-dates/${tournamentId}`
      )
    );
  }

  async getGames(): Promise<any> {
    return await lastValueFrom(
      this.http.get<any>(`${this.apiUrl}calendars/games/`)
    );
  }

  async getMatchesByDate(dateId: number): Promise<any> {
    return await firstValueFrom(
      this.http.get(`${this.apiUrl}calendars/games-by-date/${dateId}`)
    );
  }
}
