import { Injectable } from '@angular/core';

export interface AuthContext {
  // Si es true, forzar la inclusión del token
  // Si es false, forzar la exclusión del token
  // Si es undefined, usar comportamiento por defecto
  forceAuth?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthContextService {
  private authContext: AuthContext = {};
  
  setAuthContext(context: AuthContext): void {
    this.authContext = context;
  }
  
  getAuthContext(): AuthContext {
    return this.authContext;
  }
  
  clearAuthContext(): void {
    this.authContext = {};
  }
  
  withAuth(): void {
    this.authContext.forceAuth = true;
  }
  
  withoutAuth(): void {
    this.authContext.forceAuth = false;
  }
}