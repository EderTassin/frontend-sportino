import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Player } from './manager/manager.component';

@Injectable({
    providedIn: 'root'
  })
  
export class ManagerService {
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  getTeamData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/team`);
  
  }

  getTeam(teamId: number): Observable<any> {
    // Dejamos que el interceptor HTTP maneje los headers de autorización
    return this.http.get(`${this.apiUrl}players/teams/${teamId}/`).pipe(
      catchError(error => {
        console.error('Error fetching team data:', error);
        return throwError(() => error);
      })
    );
  }

  updateTeamData(teamData: any, teamId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.put(`${this.apiUrl}players/teams/${teamId}/`, teamData, { headers });
  }

  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/players`);
  }

  addPlayer(player: any, teamId: number, file: File | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const formData = new FormData();
    formData.append('full_name', player.full_name);
    formData.append('birthday', this.formatDate(player.birthDate));
    formData.append('id_card', player.id_card);
    formData.append('year', player.year);
    formData.append('street', player.street);
    formData.append('number', player.number);
    formData.append('neighborhood', player.neighborhood);
    formData.append('phone', player.phone);
    formData.append('cell_phone', player.phone);
    formData.append('email', player.email);
    formData.append('medical_certificate', '');
    formData.append('date_certificate', '');
    formData.append('date', this.formatDate(new Date()));
    formData.append('active', player.active ? 'true' : 'false');
    formData.append('team', teamId.toString());

    if (file) {
      formData.append('picture_file', file, file.name);
    }

    return this.http.post(`${this.apiUrl}players/players/`, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error adding player:', error);
        return throwError(error);
      })
    );
  }

  updatePlayer(player: Player, file: File | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const formData = new FormData();
    formData.append('full_name', player.full_name);
    formData.append('birthday', player.birthDate ? this.formatDate(new Date(player.birthDate)) : '');
    formData.append('id_card', player.id_card);
    formData.append('year', player.year || '');
    formData.append('street', player.street);
    formData.append('number', '');
    formData.append('neighborhood', '');
    formData.append('phone', player.phone);
    formData.append('cell_phone', player.cell_phone || '');
    formData.append('email', player.email);
    formData.append('medical_certificate', '');
    formData.append('date_certificate', '');
    formData.append('date', this.formatDate(new Date()));
    formData.append('active', player.active ? 'true' : 'false');
    formData.append('team', player.team.id.toString());

    if (file) {
      formData.append('picture_file', file, file.name);
    }

    return this.http.put(`${this.apiUrl}players/players/${player.id}/`, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error updating player:', error);
        return throwError(error);
      })
    );
  }

  deletePlayer(playerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/players/${playerId}`);
  }

  updatePlayerMedicalCertificate(player: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const formData = new FormData();
    formData.append('medical_certificate', player.medical_certificate ? 'true' : 'false');
    
    return this.http.patch(`${this.apiUrl}players/players/${player.id}/`, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error updating medical certificate:', error);
        return throwError(() => error);
      })
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
