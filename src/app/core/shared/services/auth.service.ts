import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? await user.getIdToken() : null;
  }

  async logout() {
    await this.auth.signOut();
  }
  constructor() { }
}
