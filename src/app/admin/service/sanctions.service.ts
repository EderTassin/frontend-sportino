import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Sanction {
  id?: number;
  sanction_for: string;
  reason: string;
  missed_dates: number;
  yellow_cards: string;
  red_card: string;
  game: number;
  team?: number;
  player?: number;
  missed_points: number;
  tournament: number;
}

export interface Tournament {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SanctionsService {
  private apiUrl = `${environment.apiEndpoint}calendars/sanctions`;
  private filterApiUrl = `${environment.apiEndpoint}calendars/sanctions-filter`;
  private tournamentsUrl = `${environment.apiEndpoint}calendars/tournament`;
  private categoriesUrl = `${environment.apiEndpoint}players/categories`;
  private teamsUrl = `${environment.apiEndpoint}players/teams`;

  constructor(private http: HttpClient) { }

  getAllSanctions(): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.apiUrl}`);
  }

  getSanctionById(id: number): Observable<Sanction> {
    return this.http.get<Sanction>(`${this.apiUrl}/${id}/`);
  }

  createSanction(sanction: Sanction): Observable<Sanction> {
    return this.http.post<Sanction>(`${this.apiUrl}/`, sanction);
  }

  updateSanction(id: number, sanction: Sanction): Observable<Sanction> {
    return this.http.put<Sanction>(`${this.apiUrl}/${id}/`, sanction);
  }

  deleteSanction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }

  filterSanctions(tournamentId?: number, teamId?: number, categoryId?: number): Observable<Sanction[]> {
    let url = `${this.filterApiUrl}/?`;
    
    if (tournamentId) {
      url += `tournament=${tournamentId}`;
    }
    
    if (teamId) {
      url += `${tournamentId ? '&' : ''}team_id=${teamId}`;
    }
    
    if (categoryId) {
      url += `${(tournamentId || teamId) ? '&' : ''}category=${categoryId}`;
    }
    
    return this.http.get<Sanction[]>(url);
  }

  getTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.tournamentsUrl}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.categoriesUrl}`);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.teamsUrl}`);
  }
}
