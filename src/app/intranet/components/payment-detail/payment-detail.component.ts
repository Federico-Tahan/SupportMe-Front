import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../core/shared/services/payment.service';
import { DateParserPipe } from '../../../core/shared/pipes/date-parser.pipe';
import { LoadingSnipperComponent } from "../../../components/loading-snipper/loading-snipper.component";
import { PaymentDetail } from '../../../core/shared/interfaces/payment-detail';


@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, DateParserPipe, LoadingSnipperComponent],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.scss'
})
export class PaymentDetailComponent implements OnInit {
  paymentService = inject(PaymentService);
  route = inject(ActivatedRoute);

  @Input() chargeId?: string;
  
  paymentDetail: PaymentDetail | null = null;
  isLoading = true;
  
  ngOnInit() {
    const queryId = this.route.snapshot.queryParamMap.get('id');
    
    if (queryId) {
      this.loadPaymentDetail(queryId);
    } else if (this.chargeId) {
      this.loadPaymentDetail(this.chargeId);
    } else {
      this.isLoading = false;
    }
  }
  
  loadPaymentDetail(id: string): void {
    this.isLoading = true;
    
    this.paymentService.getPaymentDetail(id).subscribe({
      next: (data) => {
        this.paymentDetail = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalles del pago:', err);
        this.isLoading = false;
      }
    });
  }
  
  isSuccessful(status: string): boolean {
    return status?.toLowerCase() === 'ok' || 
           status?.toLowerCase() === 'successful' || 
           status?.toLowerCase() === 'completed';
  }
  
  getCardIconClass(brand: string): string {
    if (!brand) return 'default-card-icon';
    
    const brandLower = brand.toLowerCase();
    
    if (brandLower.includes('visa')) {
      return 'visa';
    } else if (brandLower.includes('master')) {
      return 'mastercard';
    } else if (brandLower.includes('amex') || brandLower.includes('american')) {
      return 'amex-icon';
    } else {
      return 'default-card-icon';
    }
  }

  hasCommissions()
  {
    return (this.paymentDetail.commissionSupportMe !== undefined && this.paymentDetail.commissionSupportMe) > 0 || (this.paymentDetail.commissionMP !== undefined && this.paymentDetail.commissionMP > 0);
  }
}