import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  router = inject(Router);
  authService = inject(AuthService);
  
  if (this.authService.checkJwt()) {
    return true;
  } else {
    const currentUrl = state.url;
    router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });

    return false;
  }
};

