import { inject } from '@angular/core';
import { Router, CanActivateFn } from "@angular/router";
import { AuthService } from './auth.service';


export const AuthGuard: CanActivateFn = () => {
  const routerService = inject(Router);
  const authService =  inject(AuthService)

  if (authService.checkAuth()) {
    return true;
  }
  
  routerService.navigate(['/']);
  return false;
};
