import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { UserProfile } from '../interfaces/user-profile';
import { Observable } from 'rxjs';
import { AuthContextService } from '../interceptor/auth-context';
import { UserRecoveryData } from '../interfaces/user-recovery-data';

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

  forgotPassword(email : string) : Observable<any>{
    return this.http.get<any>(environment.backApi + "user/password/forgot?email=" + email) 
  }

  getRecoveryDataUser(token : string) : Observable<UserRecoveryData>{
  return this.http.get<UserRecoveryData>(environment.backApi + "user/password/user/data?token=" + token) 
  }

  changePassword(token : string, password : string) : Observable<any>{
  return this.http.get<any>(environment.backApi + "user/password/change?token=" + token + "&newpassword=" + password) 
  }
}