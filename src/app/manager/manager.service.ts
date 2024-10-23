import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    console.log(headers.get('Authorization'));

    return this.http.get(`${this.apiUrl}players/teams/${teamId}`, { headers });
  }

  updateTeamData(teamData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/team`, teamData);
  }

  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/players`);
  }

  addPlayer(player: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/players`, player);
  }

  updatePlayer(player: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/players/${player.id}`, player);
  }

  deletePlayer(playerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/players/${playerId}`);
  }
}
