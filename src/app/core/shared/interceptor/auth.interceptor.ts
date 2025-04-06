import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { AuthService } from '../services/auth.service';
import { AuthContextService } from './auth-context';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('TokenInterceptor: Interceptando petición a', req.url);
  
  const authService = inject(AuthService);
  const authContextService = inject(AuthContextService);
  
  if (!req.url.startsWith(environment.backApi)) {
    return next(req);
  }

  const authContext = authContextService.getAuthContext();
  
  const user = authService.getCurrentUser();
  
  const urlHasNoAuthFlag = req.url.includes('_noauth=true');
  
  let modifiedReq = req;
  
  if (urlHasNoAuthFlag) {
    const cleanUrl = req.url.replace('_noauth=true', '').replace(/[&?]$/, '');
    modifiedReq = req.clone({
      url: cleanUrl
    });
  } else if (authContext.forceAuth === true) {
    if (user && user.token) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
    }
  } else if (authContext.forceAuth === false) {

  } else {

    if (user && user.token && !isNoAuthRoute(req.url)) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
    }
  }
  
  authContextService.clearAuthContext();
  
  console.log('TokenInterceptor: Petición procesada', 
    modifiedReq.headers.has('Authorization') ? 'CON token' : 'SIN token');
  
  return next(modifiedReq);
};


function isNoAuthRoute(url: string): boolean {
  const noAuthRoutes = [
    'user/login',
    'user/register',
    'public/'
  ];
  
  const endpoint = getEndpointPath(url);
  
  for (const route of noAuthRoutes) {
    if (endpoint.startsWith(route)) {
      return true;
    }
  }
  
  return false;
}


function getEndpointPath(url: string): string {
  const apiBase = environment.backApi;
  return url.replace(apiBase, '');
}