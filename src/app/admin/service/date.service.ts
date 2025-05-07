import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Team {
  id: number;
  name: string;
  category: string;
  logo_file: string | null;
}

export interface GameResult {
  goals_team_1: number | null;
  goals_team_2: number | null;
}

export interface Game {
  id?: number;
  hour: string;
  date: string;
  tournament: number | null;
  team_1: Team;
  team_2: Team;
  field: any | null;
  observer: any | null;
  referee: any | null;
  result: GameResult | null;
}

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private apiUrl = `${environment.apiEndpoint}calendars/`;

  constructor(private http: HttpClient) { }

  getGamesByDate(dateId: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}games-by-date/${dateId}`);
  }

  createGame(game: Game[]): Observable<Game[]> {
    return this.http.post<Game[]>(`${this.apiUrl}games/`, game);
  }

  updateGame(gameId: number, game: Game): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}games/${gameId}/`, game);
  }

  deleteGame(gameId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}games/${gameId}/`);
  }

  getDateById(dateId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}dates/${dateId}/`);
  }
}
