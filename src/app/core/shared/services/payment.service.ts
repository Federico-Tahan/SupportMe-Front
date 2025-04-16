import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { PaymentInformation } from '../interfaces/payment-information';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  http = inject(HttpClient);

  payment(paymentInformation : PaymentInformation) : Observable<any>{
    return this.http.post(environment.backApi + '/payment', paymentInformation);
   }
}
