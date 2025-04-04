import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, getAuth, onIdTokenChanged  } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor() {
        onIdTokenChanged(this.auth, async (user) => {
            if (user) {
              const token = await user.getIdToken();
                        localStorage.setItem('firebase_token', token);
          
              this.loginbk(token).subscribe({
                next: (res) => console.log("Token actualizado en backend:", res),
                error: (err) => console.error("Error al actualizar token en backend:", err)
              });
            } else {
              localStorage.removeItem('firebase_token');
              console.log("Usuario deslogueado, token eliminado.");
            }
          });
      }

  private auth = inject(Auth);
  http = inject(HttpClient);

  async login(email: string, password: string)  {
    var userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => userCredential.user)
      .catch(error => {
        console.error("Error en login:", error);
        throw error;
      });
}

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? await user.getIdToken() : null;
  }

  async logout() {
    await this.auth.signOut();
  }

  loginbk(token : string) : Observable<any>{
     return this.http.post<any>(environment.backApi + 'user/login', {token : token});
  }

  checkJwt(): boolean {
    return localStorage.getItem('firebase_token') == null || localStorage.getItem('firebase_token') === undefined ? false : true;
  }
}
