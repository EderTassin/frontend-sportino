import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  
export class ManagerService {
  private apiUrl = 'http://api.example.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getTeamData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/team`);
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
