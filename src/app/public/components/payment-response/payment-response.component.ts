import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-response',
  standalone: true,
  imports: [],
  templateUrl: './payment-response.component.html',
  styleUrl: './payment-response.component.scss'
})
export class PaymentResponseComponent {
  amount: number = 100;
  emailSent: boolean = true;
  donationPurpose: string = 'Empower a Girl For Self-Reliance';
  logoUrl: string = 'https://supportme2.s3.sa-east-1.amazonaws.com/Selection+(1).png';
  
}
