import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { PaymentInformation } from '../interfaces/payment-information';
import { Observable } from 'rxjs';
import { Pagination } from '../interfaces/pagination';
import { PaymentDetailRead } from '../interfaces/payment-detail-read';
import { Livefeedpayment } from '../interfaces/livefeedpayment';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  http = inject(HttpClient);

  payment(paymentInformation : PaymentInformation, campaignId : number) : Observable<any>{
    return this.http.post(environment.backApi + 'payment/' + campaignId + '/campaign', paymentInformation);
   }

   payments() : Observable<Livefeedpayment>{
    return this.http.get<Livefeedpayment>(environment.backApi + 'payment/');
   }

  getPublicKey(campaignId : number) : Observable<any>{
  return this.http.get(environment.backApi + 'mercadopago/public-key/' + campaignId + '/campaign');
  }
}
