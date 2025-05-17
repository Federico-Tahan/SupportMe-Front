import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { PaymentInformation } from '../interfaces/payment-information';
import { Observable } from 'rxjs';
import { Pagination } from '../interfaces/pagination';
import { PaymentDetailRead } from '../interfaces/payment-detail-read';
import { Livefeedpayment } from '../interfaces/livefeedpayment';
import { PaymentFilter } from '../interfaces/payment-filter';
import { PaymentDonation } from '../interfaces/payment-donation';
import { PaymentDetail } from '../interfaces/payment-detail';
import { AuthContextService } from '../interceptor/auth-context';
import { SimpleDonations } from '../interfaces/simple-donations';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  http = inject(HttpClient);
  authContextService = inject(AuthContextService);

  payment(paymentInformation : PaymentInformation, campaignId : number) : Observable<any>{
    return this.http.post(environment.backApi + 'payment/' + campaignId + '/campaign', paymentInformation);
   }

   getPaymentDonation(chargeId : string): Observable<PaymentDonation> {
    return this.http.get<PaymentDonation>(environment.backApi + 'payment/' + chargeId + "/donation" );
  }
  getPaymentDetail(chargeId : string): Observable<PaymentDetail> {
    this.authContextService.withAuth();
    return this.http.get<PaymentDetail>(environment.backApi + 'payment/' + chargeId + "/detail" );
  }

  getDonationsPayments(skip : number, take : number): Observable<SimpleDonations[]> {
    this.authContextService.withAuth();
    let params = new HttpParams()
      .set('take', take.toString())
      .set('skip', skip.toString());

    return this.http.get<SimpleDonations[]>(environment.backApi + 'payment/donations', { params });
  }

   getPayments(filter: PaymentFilter): Observable<Livefeedpayment> {
    let params = new HttpParams()
      .set('limit', filter.Limit.toString())
      .set('skip', filter.skip.toString());

    if (filter.from) {
      params = params.set('from', filter.from.toISOString());
    }
    
    if (filter.to) {
      params = params.set('to', filter.to.toISOString());
    }
    
    if (filter.textFilter && filter.textFilter.trim() !== '') {
      params = params.set('search', filter.textFilter);
    }
    
    if (filter.brand && filter.brand.length > 0) {
      filter.brand.forEach(brand => {
        params = params.append('brand', brand);
      });
    }
    
    if (filter.campaignId && filter.campaignId.length > 0) {
      filter.campaignId.forEach(campaignId => {
        params = params.append('campaignId', campaignId.toString());
      });
    }
    
    if (filter.status && filter.status.length > 0) {
      filter.status.forEach(status => {
        params = params.append('status', status);
      });
    }
    
    return this.http.get<Livefeedpayment>(environment.backApi + 'payment', { params });
  }
  getPublicKey(campaignId : number) : Observable<any>{
  return this.http.get(environment.backApi + 'mercadopago/public-key/' + campaignId + '/campaign');
  }
}
