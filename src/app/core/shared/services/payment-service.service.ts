import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { BaseValidation } from '../interfaces/base-validation';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
  http = inject(HttpClient);
 
  paymentAPI = environment.backApi;
  
  vinculateMP(code : string) : Observable<BaseValidation>{
    return this.http.post<BaseValidation>(this.paymentAPI + 'mercadopago/oauth/token/generate?code=' + code, null);
   }
   DeleteTokenMP() : Observable<BaseValidation>{
    return this.http.delete<BaseValidation>(this.paymentAPI + 'mercadopago/oauth/token');
   }
  
  }
