import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import {inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

export interface Tournament {
  id?: number;
  name: string;
  description?: string;
  date_from: string;
  date_to: string;
  active: boolean;
  category: number[];
  parent?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiEndpoint;
  private isAuthenticated = inject(AuthService).checkAuth();

  constructor(private http: HttpClient) {}
  
  async createTeam(team: any): Promise<any> {
    return lastValueFrom(
      this.http.post<any>(`${this.apiUrl}players/teams/`, team)
    );
  }

  async updateTeam(team: FormData) {
    return lastValueFrom(
      this.http.put<any>(`${this.apiUrl}players/teams/${team.get("id")}/`, team)
    );
  }

  async getReferees() {
    return lastValueFrom(
      this.http.get<any>(`${this.apiUrl}users/referees/`)
    );
  }

  async getTeams(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.apiUrl}players/teams/`));
  }

  async getDelegados() {
    return await lastValueFrom(this.http.get<any>(`${this.apiUrl}players/managers/`));
  }

  deleteDelegado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}players/managers/${id}/`);
  }

  updateDelegado(managerId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}users/confirmation/?manager_id=${managerId}`, null);
  }

  updateDelegadoPassword(managerId: number, delegadoPassword: any): Observable<any> {
    const data = {
      email: delegadoPassword.email,
      password: delegadoPassword.password
    };
    return this.http.put<any>(`${this.apiUrl}players/managers/${managerId}/`, data);
  }

  async getTournaments(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.apiUrl}calendars/tournament/`));
  }

  async getTournamentById(id: number): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.apiUrl}calendars/tournament/${id}/`));
  }

  async getDatesByTournament(id: number): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.apiUrl}calendars/tournament-dates/${id}`));
  }

  async getGamesByTournamentId(id: number): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.apiUrl}calendars/games-by-tournament/${id}`));
  }

  async createTournament(tournamentData: Partial<Tournament>): Promise<any> {
    return await lastValueFrom(
      this.http.post<any>(`${this.apiUrl}calendars/tournament/`, tournamentData)
    );
  }

  async updateTournament(id: number, tournamentData: Partial<Tournament>): Promise<any> {
    return await lastValueFrom(
      this.http.put<any>(`${this.apiUrl}calendars/tournament/${id}/`, tournamentData)
    );
  }

  async createSubTournament(parentId: number, tournamentData: Partial<Tournament>): Promise<any> {
    const subTournamentData = {
      ...tournamentData,
      parent: parentId
    };
    
    return await lastValueFrom(
      this.http.post<any>(`${this.apiUrl}calendars/tournament/`, subTournamentData)
    );
  }

  deleteTournament(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}calendars/tournament/${id}/`);
  }

  imprimirDocumentosDate(dateId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}calendars/date-report-pdf/?date_id=${dateId}`, {
      responseType: 'blob'
    });
  }

  imprimirDocumentosGame(gameId: number, tournamentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}calendars/game-report-pdf/?date_id=${gameId}&tournament_id=${tournamentId}`, {
      responseType: 'blob'
    });
  }

  toggleDelegados(active: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}players/toggle-managers-active-status/?active=${active}`, null);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}players/teams/${id}/`);
  }
  
  async getBackupData(): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiUrl}users/dbdump/dump/`, {
      responseType: 'json'
    }));
  }
}
