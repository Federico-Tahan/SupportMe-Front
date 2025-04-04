// auth-interceptor.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  console.log('TESTTTTTTTTT');

  // Verifica que la URL sea la que estamos buscando
  if (req.url.includes('identitytoolkit.googleapis.com/v1/accounts:lookup')) {
    console.log('Intercepted lookup request:', req.url);
  }
  
  return next(req).pipe(
    tap({
      next: (event) => {
        // Es importante comprobar si es una respuesta HTTP
        if (event.type === 4 && req.url.includes('identitytoolkit.googleapis.com/v1/accounts:lookup')) {
          console.log('Firebase lookup response received');
          
          // Llamar a loginbk
          authService.getToken().then(token => {
            if (token) {
              console.log('Calling loginbk with token');
              authService.loginbk(token).subscribe({
                next: (response) => {
                  localStorage.setItem('JWT_TOKEN', response.token);
                  console.log('Backend token updated after lookup');
                },
                error: (err) => {
                  console.error('Error getting backend token after lookup:', err);
                }
              });
            } else {
              console.log('No token available');
            }
          });
        }
      },
      error: (error) => {
        console.error('HTTP request failed:', error);
      }
    })
  );
};