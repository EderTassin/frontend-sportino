import { inject } from '@angular/core';
import { Router, CanActivateFn } from "@angular/router";
import { AuthService } from './auth.service';


export const AuthGuard: CanActivateFn = () => {
  const routerService = inject(Router);
  const authService =  inject(AuthService)

  if (authService.checkAuth() && authService.isAdmin()) {
    return true;
  }
  
  routerService.navigate(['/']);
  authService.logout();
  return false;
};

export const UserGuard: CanActivateFn = () => {
  const routerService = inject(Router);
  const authService =  inject(AuthService)

  if (authService.checkAuth() && authService.isManager()) {
    return true;
  }

  routerService.navigate(['/']);
  authService.logout();
  return false;
}