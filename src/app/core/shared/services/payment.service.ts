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

  payment(paymentInformation : PaymentInformation, campaignId : number) : Observable<any>{
    return this.http.post(environment.backApi + 'payment/' + campaignId + '/campaign', paymentInformation);
   }

  getPublicKey(campaignId : number) : Observable<any>{
  return this.http.get(environment.backApi + 'mercadopago/public-key/' + campaignId + '/campaign');
  }
}
