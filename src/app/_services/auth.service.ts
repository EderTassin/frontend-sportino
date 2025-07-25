import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(localStorage.getItem('isAuthenticated') === 'true');
  private timeoutHandle: any;
  private readonly TIMEOUT_DURATION = 240 * 60 * 1000;

  private apiUrl = environment.apiEndpoint;
  authStatus = this.isAuthenticated.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    if (this.isAuthenticated.value) {
      this.resetTimeout();
    }
  }

  async login(email: string, pass: string): Promise<boolean> {

    const body = {
      email: email,
      password: pass
    }

    try {
      const res = await firstValueFrom(this.http.post(`${this.apiUrl}api-token-auth/`, body)) as any;  
      localStorage.setItem('token', res.access);
      if (res) {
        this.isAuthenticated.next(true);
        localStorage.setItem('isAuthenticated', 'true');

        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }

    return false;
  }

  logout() {
    this.isAuthenticated.next(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    this.clearTimeout();
    this.router.navigate(['/']);
  }

  async getUser(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return null;
    }
    
    try {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      
      if (decodedToken?.user_id) {
        try {
          const resp = await firstValueFrom(this.http.get(`${this.apiUrl}users/users/${decodedToken.user_id}/`)) as any;
          return resp;
        } catch (error) {
          console.error('Error fetching user data:', error);
          return null;
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
    }
    
    return null;
  }

  checkAuth(): Observable<boolean> {
    const isAuthenticated = this.isAuthenticated.value;
    return of(isAuthenticated);
  }

  private resetTimeout() {
    this.clearTimeout();
    this.timeoutHandle = setTimeout(() => this.logout(), this.TIMEOUT_DURATION);
  }

  private clearTimeout() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  }


  public isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      return decodedToken?.admin || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  public decodeToken(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const jwtHelper = new JwtHelperService();
      return jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  public isManager(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      
      if (decodedToken?.group && Array.isArray(decodedToken.group) && decodedToken.group.includes('MANAGER')) {
        return true;
      }
    } catch (error) {
      console.error('Error checking manager status:', error);
    }

    this.logout();
    return false;
  }

  public userInteracted() {
    if (this.isAuthenticated.value) {
      this.resetTimeout();
    }
  }
}
