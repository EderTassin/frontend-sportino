import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  private publicRoutes: string[] = [
    'api-token-auth',
    'calendars/',
    'players/teams',
    'match-statistics',
    'players/players',
    'players/getnewteams',
    'players/managers'
  ];
  
  private publicComponents: string[] = [
    '/home',
    '/tournament',
    '/match-statistics',
    '/calendars/tournament',
    '/calendars/board',
    '/players/teams',
    '/players/managers',
    '/players/players'
  ];

  private isPublicUrl(url: string): boolean {
    if (this.publicRoutes.some(route => url.includes(route))) {
      return true;
    }
    
    const referer = window.location.pathname;
    return this.publicComponents.some(component => referer.startsWith(component));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isPublicUrl(req.url)) {
      return next.handle(req);
    }

    return this.authService.checkAuth().pipe(   
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return throwError(() => new Error('No autenticado'));
        }
        
        const token = localStorage.getItem('token');
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }

        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}