import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  login(email: string, securityKey: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, securityKey })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  async register(delegateData: any) {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}players/managers/`, delegateData, {
          observe: 'response',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      
      return response.body;
    } catch (error: any) {
      console.error('Error in register service:', error);
      
      if (error.status) {
        console.error('Error status:', error.status);
      }
      
      if (error.error) {
        console.error('Error response body:', error.error);
      }
      
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async getTeamsFree() {
    const teams = await firstValueFrom(
         this.http.get<any>(`${this.apiUrl}players/getnewteams/`)
    );

    return teams;
  }

}
