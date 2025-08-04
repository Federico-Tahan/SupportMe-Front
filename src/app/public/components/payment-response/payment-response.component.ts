import { Component, inject, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/shared/services/payment.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-response',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-response.component.html',
  styleUrl: './payment-response.component.scss'
})
export class PaymentResponseComponent implements OnInit {
  paymentService = inject(PaymentService);
  router = inject(ActivatedRoute);
  
  amount: number = 0;
  emailSent: boolean = true;
  donationPurpose: string = '';
  logoUrl: string = 'https://supportme.site:9000/supporme/campaigns/assets/e8f26311-191b-4c7a-93c4-fd39031fd62f.jpg';
  
  loading: boolean = true;
  error: boolean = false;
  errorMessage: string = '';
  
  ngOnInit(): void {
    this.loading = true;
    this.router.queryParams.subscribe(params => {
      if (params['chargeId']) {
        const chargeId = params['chargeId'];
        this.paymentService.getPaymentDonation(chargeId).subscribe({
          next: (paymentData) => {
            this.amount = paymentData.amount;
            this.donationPurpose = paymentData.campaignName;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error retrieving payment data:', error);
            this.error = true;
            this.errorMessage = 'Hubo un problema al procesar su donación.';
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    });
  }
}