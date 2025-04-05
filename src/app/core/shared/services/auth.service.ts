import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, getAuth, onIdTokenChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { UserToken } from '../interfaces/user-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserToken | null>(null);
  userChanges$ = this.userSubject.asObservable();
  
  private auth = inject(Auth);
  http = inject(HttpClient);

  constructor() {
    // Intentar cargar el usuario desde localStorage al iniciar
    this.loadUserFromStorage();
    
    // Configurar listener para cambios en el token de Firebase
    onIdTokenChanged(this.auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        
        this.loginbk(token).subscribe({
          next: (res) => {
            localStorage.setItem('user', JSON.stringify(res));
            this.userSubject.next(res); // Actualizar el observable
          },
          error: (err) => console.error("Error al actualizar token en backend:", err)
        });
      } else {
        localStorage.removeItem('user');
        this.userSubject.next(null); // Actualizar el observable
        console.log("Usuario deslogueado, token eliminado.");
      }
    });
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as UserToken;
        this.userSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }

  async login(email: string, password: string): Promise<UserToken> {
    return new Promise(async (resolve, reject) => {
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const token = await userCredential.user.getIdToken();
        
        this.loginbk(token).subscribe({
          next: (res: UserToken) => {
            localStorage.setItem('user', JSON.stringify(res));
            this.userSubject.next(res);
            resolve(res);
          },
          error: (err) => {
            console.error("Error al actualizar token en backend:", err);
            reject(err);
          }
        });
      } catch (error) {
        console.error("Error en login:", error);
        reject(error);
      }
    });
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? await user.getIdToken() : null;
  }

  async logout() {
    await this.auth.signOut();
    localStorage.removeItem('user');
    this.userSubject.next(null); // Actualizar el observable
  }

  loginbk(token: string): Observable<UserToken> {
    return this.http.post<UserToken>(environment.backApi + 'user/login', {token: token});
  }

  checkJwt(): boolean {
    return localStorage.getItem('user') != null;
  }
  
  // Método para obtener el usuario actual
  getCurrentUser(): UserToken | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson) as UserToken;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  }
}