import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent implements OnInit {
  currentStep = 1;
  donationType: 'one-off' | 'monthly' = 'one-off';
  donationAmount: number | null = null;
  customAmount: string = '';
  donationMessage: string = '';
  @Input() title: string = '';
  paymentForm: FormGroup;
  billingForm: FormGroup;
  
  predefinedAmounts = [1000, 2500, 5000, 10000];
  
  // Variables para el formato de la tarjeta
  cardNumberFormatted: string = '';
  cardBrand: string = 'visa';
  
  // Variables para la fecha de expiración
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
      email: new FormControl('', [Validators.required, Validators.email]),
      contactNumber: new FormControl('', [Validators.required])
    });
  }
  
  ngOnInit(): void {
    // No necesitamos suscribirnos a los cambios aquí
  }
  
  // Formatea el número de tarjeta como XXXX XXXX XXXX XXXX
  formatCardNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    // Remover todos los caracteres no numéricos
    const cleanValue = inputElement.value.replace(/\D/g, '');
    
    // Limitar a 16 dígitos
    const truncated = cleanValue.substring(0, 16);
    
    // Formatear como XXXX XXXX XXXX XXXX
    const parts = [];
    for (let i = 0; i < truncated.length; i += 4) {
      parts.push(truncated.substring(i, i + 4));
    }
    
    // Actualizar el valor del input y la variable formateada
    this.cardNumberFormatted = parts.join(' ');
    
    // Importante: Actualizar el valor del elemento input directamente
    inputElement.value = this.cardNumberFormatted;
    
    // Actualizar el formulario con el valor formateado para mantener la sincronización
    this.paymentForm.get('cardNumber')?.setValue(this.cardNumberFormatted);
    
    // Detectar la marca de la tarjeta (usando el valor limpio)
    this.detectCardBrand(cleanValue);
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
    
    if (this.currentStep === 3 && this.billingForm.invalid) {
      this.markFormGroupTouched(this.billingForm);
      return;
    }
    
    if (this.currentStep < 3) {
      this.currentStep++;
    } else {
      this.submitDonation();
    }
  }
  
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  setDonationType(type: 'one-off' | 'monthly'): void {
    this.donationType = type;
  }
  
  setDonationAmount(amount: number): void {
    this.donationAmount = amount;
    this.customAmount = amount.toString();
  }
  
  setCustomAmount(): void {
    const amount = parseFloat(this.customAmount);
    if (!isNaN(amount) && amount > 0) {
      this.donationAmount = amount;
    } else {
      this.donationAmount = null;
    }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  submitDonation(): void {
    console.log('Donation submitted', {
      donationType: this.donationType,
      amount: this.donationAmount,
      message: this.donationMessage,
      payment: {
        ...this.paymentForm.value,
        cardBrand: this.cardBrand
      },
      billing: this.billingForm.value
    });
    
    this.currentStep = 1;
    this.donationAmount = null;
    this.customAmount = '';
    this.donationMessage = '';
    this.cardNumberFormatted = '';
    this.cardBrand = '';
    this.expiryMonth = '';
    this.expiryYear = '';
    this.paymentForm.reset();
    this.billingForm.reset();
    
    alert('¡Gracias por tu donación!');
  }
  
  goToMainSite(): void {
    console.log('Navigating back to main site');
  }
}