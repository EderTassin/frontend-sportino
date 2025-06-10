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

  async updateTournament(tournamentId: number, data: any): Promise<any> {
    return await firstValueFrom(this.http.put(`${this.apiUrl}calendars/tournament/${tournamentId}`, data));
  }

  async getTournamentById(tournamentId: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.apiUrl}calendars/tournament/${tournamentId}`));
  }

  async addDates(data: any): Promise<any> {
    return await firstValueFrom(this.http.post(`${this.apiUrl}calendars/dates/`, data));
  }

  async getDates(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.apiUrl}calendars/dates/`));
  }

  async addMatches(data: any): Promise<any> {
    return await firstValueFrom(this.http.post(`${this.apiUrl}calendars/games/`, data));
  }

  async getMatchesByDate(dateId: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.apiUrl}calendars/games-by-date/${dateId}`));
  }

  async getDatesByTournament(tournamentId: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.apiUrl}calendars/tournament-dates/${tournamentId}`));
  }

  async deleteDate(dateId: string): Promise<any> {
    return await firstValueFrom(this.http.delete(`${this.apiUrl}calendars/dates/${dateId}/`));
  }

  async createGoal(newGoal: any): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    try {
      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}calendars/goals/`, newGoal, { headers })
      );
      return response;
    } catch (error) {
      console.error('Servicio - Error al crear gol:', error);
      throw error;
    }
  }

  async deleteGoal(goalId: number): Promise<any> {
    return await firstValueFrom(this.http.delete(`${this.apiUrl}calendars/goals/${goalId}/`));
  }

  async createSanction(newSanction: any): Promise<any> {
    return await firstValueFrom(this.http.post(`${this.apiUrl}calendars/sanctions/`, newSanction));
  }

  async deleteSanction(sanctionId: number): Promise<any> {
    return await firstValueFrom(this.http.delete(`${this.apiUrl}calendars/sanctions/${sanctionId}/`));
  }

  async getFields(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.apiUrl}calendars/fields/`));
  }
}
