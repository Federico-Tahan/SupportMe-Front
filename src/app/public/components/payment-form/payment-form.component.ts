import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Campaign } from '../../../core/shared/interfaces/campaign';
import { MercadopagoService } from '../../../core/shared/services/mercadopago.service';
import { PaymentService } from '../../../core/shared/services/payment.service';
import { Card } from '../../../core/shared/interfaces/card';
import { MpCard } from '../../../core/shared/interfaces/mp-card';
import { PaymentInformation } from '../../../core/shared/interfaces/payment-information';
import { environment } from '../../../../environment/environment';
import { LoadingSnipperComponent } from '../../../components/loading-snipper/loading-snipper.component';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, LoadingSnipperComponent],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent implements OnInit {
  currentStep = 1;
  publicKey : string = undefined;
  donationAmount: number | null = null;
  campaignId : number = undefined;
  customAmount: string = '';
  donationMessage: string = '';
  campaign : Campaign = undefined;
  paymentForm: FormGroup;
  billingForm: FormGroup;
  campaignService = inject(CampaignService);
  predefinedAmounts = [1000, 2500, 5000, 10000];
  router = inject(ActivatedRoute);
  route = inject(Router);
  mpService = inject(MercadopagoService);
  paymentService = inject(PaymentService);
  cardNumberFormatted: string = '';
  cardBrand: string = 'visa';
  isLoading: boolean = false;
  paymentError: string = '';
  expiryMonth: string = '';
  expiryYear: string = '';
  
  constructor() {
    this.paymentForm = new FormGroup({
      cardNumber: new FormControl('', [Validators.required]),
      cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}$/)]), // Cambiado a exactamente 3 dígitos
      expiryMonth: new FormControl('', [Validators.required]),
      expiryYear: new FormControl('', [Validators.required])
    });
    
    this.billingForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      documentNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      description: new FormControl(''),
      amountSelected: new FormControl(null)
    });
  }

  setDonationMessage(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    this.donationMessage = inputElement.value;
    this.billingForm.get('description')?.setValue(this.donationMessage);
  }
  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.campaignId = params['campaignId'];
      if (this.campaignId) {
        this.campaignService.getCampaignById(this.campaignId).subscribe({
          next: (data) => {
            this.campaign = data;
            
            this.paymentService.getPublicKey(this.campaignId).subscribe({
              next: (response) => {
                this.publicKey = response.token;
                this.mpService.loadMercadoPagoSDK(this.publicKey);
              },
              error: (error) => {
                console.error('Error al obtener la clave pública:', error);
              }
            });
          },
          error: (error) => {
            console.error('Error al obtener la campaña:', error);
          }
        });
      }
    });
  }
  
  getDeviceId(): string {
    return (window as any).MP_DEVICE_SESSION_ID || '';
  }

  formatCardNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const cleanValue = inputElement.value.replace(/\D/g, '');
    const truncated = cleanValue.substring(0, 16);
    const parts = [];
    for (let i = 0; i < truncated.length; i += 4) {
      parts.push(truncated.substring(i, i + 4));
    }
    this.cardNumberFormatted = parts.join(' ');
    inputElement.value = this.cardNumberFormatted;
    this.paymentForm.get('cardNumber')?.setValue(this.cardNumberFormatted);
    this.detectCardBrand(cleanValue);
  }
  
  async generateCard(card: MpCard): Promise<Card> {
    card.cardNumber = card.cardNumber.replace(/\D/g, '');
    return this.mpService.generateCardToken(card)
      .then(async (mpResponse: any) => {
 
        const lastFourDigits = card.cardNumber.slice(-4);
        let resposne : Card = {
          token : mpResponse.id,
          cardHolderEmail : card.cardholderEmail,
          cardHolderName : card.cardholderName,
          brand : await this.mpService.generatePaymentMethod(card.cardNumber),
          last4 : lastFourDigits,
          expiryMonth : card.cardExpirationMonth,
          expiryYear : card.cardExpirationYear,
          documentNumber : card.identificationNumber,
          documentType : card.identificationType
        }
        return resposne;
      })
      .catch((error: any) => {
        console.error("Error al generar la tarjeta:", error);
        throw error;
      });
  }
  
  submitDonation(): void {
    // Limpiar cualquier mensaje de error previo
    this.paymentError = '';
    
    // Mostrar el spinner de carga
    this.isLoading = true;
    
    const paymentForm = this.paymentForm?.value;
    const billingForm = this.billingForm?.value;
    const deviceId = this.getDeviceId(); 
    let mpCard : MpCard = {
      cardExpirationMonth : paymentForm.expiryMonth,
      cardExpirationYear : paymentForm.expiryYear,
      cardNumber : paymentForm.cardNumber,
      cardholderName: this.publicKey?.toLowerCase().includes('test') 
        ? 'APRO' 
        : billingForm.firstName + ' ' + billingForm.lastName,    
      cardholderEmail : billingForm.email,
      securityCode : paymentForm.cvv,
      identificationType : 'DNI',
      identificationNumber : billingForm.documentNumber
    }
    
    this.generateCard(mpCard).then((card: Card) => {
      const paymentInformation: PaymentInformation = {
        card: card,
        installments: 1,
        currency: 'ARS',
        amount: billingForm.amountSelected,
        deviceId: deviceId,
        idempotency : this.generateGuid(),
        description : billingForm.description
      };
  
      this.paymentService.payment(paymentInformation, this.campaignId).subscribe({
        next: (data) => {
          this.isLoading = false;
          if (data.status == 'SUCCESS') {
            this.route.navigateByUrl('/payment/response?chargeId=' + data.response.chargeId);
          } else {
            this.paymentError = 'No se pudo procesar el pago. Por favor, inténtelo nuevamente con otra tarjeta.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al procesar el pago:', error);
          if (error.status === 400 || error.status === 402) {
            this.paymentError = 'El pago fue rechazado. Por favor, verifique los datos de su tarjeta e inténtelo nuevamente.';
          } else if (error.status === 401 || error.status === 403) {
            this.paymentError = 'Error de autenticación al procesar el pago. Por favor, inténtelo más tarde.';
          } else {
            this.paymentError = 'No se pudo procesar el pago. Por favor, inténtelo nuevamente con otra tarjeta o más tarde.';
          }
        }
      });
    }).catch(error => {
      this.isLoading = false;
      console.error("Error al procesar la tarjeta:", error);
      this.paymentError = 'Error al procesar la tarjeta. Por favor, verifique los datos e inténtelo nuevamente.';
    });
  }

  generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  detectCardBrand(cardNumber: string): void {
    if (/^4/.test(cardNumber)) {
      this.cardBrand = 'visa';
    } else if (/^(5[0-5]|2[2-7])/.test(cardNumber)) {
      this.cardBrand = 'mastercard';
    } else if (/^3[47]/.test(cardNumber)) {
      this.cardBrand = 'amex';
    } else if (/^6(?:011|5)/.test(cardNumber)) {
      this.cardBrand = 'discover';
    } else if (/^3(?:0[0-5]|[68])/.test(cardNumber)) {
      this.cardBrand = 'diners';
    } else if (/^(?:2131|1800|35)/.test(cardNumber)) {
      this.cardBrand = 'jcb';
    } else {
      this.cardBrand = '';
    }
  }
  
  validateExpiryDate(month: string, year: string): boolean {
    if (!month || !year) return false;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }
    
    return true;
  }
  
  onExpiryInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value.replace(/\D/g, '');
    
    if (input.length > 4) {
      input = input.slice(0, 4);
    }
    
    if (input.length > 0) {
      let month = input.substring(0, 2);
      
      const monthNum = parseInt(month);
      if (month.length === 1 && monthNum > 1) {
        month = '0' + month;
      } else if (monthNum > 12) {
        month = '12';
      } else if (month === '00') {
        month = '01';
      }
      
      this.expiryMonth = month;
      this.paymentForm.get('expiryMonth')?.setValue(month, { emitEvent: false });
      
      if (input.length <= 2) {
        inputElement.value = month;
      } else {
        const year = input.substring(2);
        this.expiryYear = '20' + year;
        this.paymentForm.get('expiryYear')?.setValue(this.expiryYear, { emitEvent: false });
        inputElement.value = month + '/' + year;
        
        if (!this.validateExpiryDate(month, this.expiryYear)) {
          this.paymentForm.get('expiryMonth')?.setErrors({ 'pastDate': true });
          this.paymentForm.get('expiryYear')?.setErrors({ 'pastDate': true });
        }
      }
    }
  }
  
  get expiryDateFormatted(): string {
    const month = this.paymentForm.get('expiryMonth')?.value || '';
    const year = this.paymentForm.get('expiryYear')?.value || '';
    
    if (month && year) {
      const shortYear = year.length === 4 ? year.substring(2, 4) : year;
      return `${month}/${shortYear}`;
    }
    return '';
  }
  
  nextStep(): void {
    if (this.currentStep === 1 && !this.donationAmount) {
      return;
    }
    
    if (this.currentStep === 2) {
      if (this.paymentForm.invalid) {
        this.markFormGroupTouched(this.paymentForm);
        return;
      }
      
      const month = this.paymentForm.get('expiryMonth')?.value;
      const year = this.paymentForm.get('expiryYear')?.value;
      if (!this.validateExpiryDate(month, year)) {
        this.paymentForm.get('expiryMonth')?.setErrors({ 'pastDate': true });
        this.paymentForm.get('expiryYear')?.setErrors({ 'pastDate': true });
        this.markFormGroupTouched(this.paymentForm);
        return;
      }
    }
    
    if (this.currentStep === 3) {
      if (this.billingForm.invalid) {
        this.markFormGroupTouched(this.billingForm);
        return;
      }
      this.submitDonation();
      return;
    }
    
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }
  
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  setDonationAmount(amount: number): void {
    this.donationAmount = amount;
    this.customAmount = amount.toString();
    this.billingForm.get('amountSelected')?.setValue(amount);
  }
  
  setCustomAmount(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.customAmount = inputElement.value;
    
    const amount = parseFloat(this.customAmount);
    if (!isNaN(amount) && amount > 0) {
      this.donationAmount = amount;
      this.billingForm.get('amountSelected')?.setValue(amount);
    } else {
      this.donationAmount = null;
      this.billingForm.get('amountSelected')?.setValue(null);
    }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}