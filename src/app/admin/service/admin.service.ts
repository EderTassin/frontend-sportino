import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import {inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

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

  async updateTeam(team: any) {
    return lastValueFrom(
      this.http.put<any>(`${this.apiUrl}players/teams/${team.id}/`, team)
    );
  }

  getTeams(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}teams`);
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

   async getTournaments(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.apiUrl}calendars/tournament/`));
  }

  deleteTournament(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}calendars/tournament/${id}/`);
  }

  imprimirDocumentos(dateId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}calendars/date-report-pdf/?date_id=${dateId}`, {
      responseType: 'blob'
    });
  }

  toggleDelegados(active: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}players/toggle-managers-active-status/?active=${active}`, null);
  }
}
