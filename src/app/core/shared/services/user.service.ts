import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { UserProfile } from '../interfaces/user-profile';
import { Observable } from 'rxjs';
import { AuthContextService } from '../interceptor/auth-context';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authContextService = inject(AuthContextService);
  http = inject(HttpClient);

  getProfile() : Observable<UserProfile>{
    this.authContextService.withAuth();
    return this.http.get<UserProfile>(environment.backApi + "user/profile");
  }
}