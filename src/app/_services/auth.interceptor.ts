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

  // Lista de rutas públicas que no requieren autenticación
  private publicRoutes: string[] = [
    'api-token-auth',
    'calendars/',  // Todas las rutas que comienzan con calendars/
    'players/teams',
    'match-statistics'
  ];
  
  // Lista de componentes que no requieren autenticación
  private publicComponents: string[] = [
    '/home',
    '/tournament',
    '/match-statistics'
  ];

  // Verifica si una URL es pública (no requiere autenticación)
  private isPublicUrl(url: string): boolean {
    // Verificar si la URL pertenece a una ruta pública de la API
    if (this.publicRoutes.some(route => url.includes(route))) {
      return true;
    }
    
    // Verificar si la solicitud proviene de un componente público
    // Esto se hace verificando el encabezado Referer
    const referer = window.location.pathname;
    return this.publicComponents.some(component => referer.startsWith(component));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Permitir solicitudes a rutas públicas sin verificar autenticación
    if (this.isPublicUrl(req.url)) {
      return next.handle(req);
    }

    // Para todas las demás solicitudes, verificar autenticación
    return this.authService.checkAuth().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          // No redirigir automáticamente para evitar ciclos infinitos
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