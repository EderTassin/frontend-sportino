import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(localStorage.getItem('isAuthenticated') === 'true');
  private timeoutHandle: any;
  private readonly TIMEOUT_DURATION = 50 * 60 * 1000;

  authStatus = this.isAuthenticated.asObservable();

  constructor(private router: Router) {
    if (this.isAuthenticated.value) {
      this.resetTimeout();
    }
  }

  async login(email: string, pass: string): Promise<boolean> {
    if (email === "admin@sportino.com" && pass === "admin123") {
      this.isAuthenticated.next(true);
      localStorage.setItem('isAuthenticated', 'true');
      this.resetTimeout();
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated.next(false);
    localStorage.removeItem('isAuthenticated');
    this.clearTimeout();
    this.router.navigate(['/']);
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

  public userInteracted() {
    if (this.isAuthenticated.value) {
      this.resetTimeout();
    }
  }
}
