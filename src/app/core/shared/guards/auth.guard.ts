import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.checkJwt()) {
    return true;
  } else {
    const currentUrl = state.url;
    router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
    return false;
  }
};
