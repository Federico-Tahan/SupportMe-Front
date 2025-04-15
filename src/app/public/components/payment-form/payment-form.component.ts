import { Component } from '@angular/core';
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
export class PaymentFormComponent {
  currentStep = 1;
  donationType: 'one-off' | 'monthly' = 'one-off';
  donationAmount: number | null = null;
  customAmount: string = '';
  donationMessage: string = '';
  
  paymentForm: FormGroup;
  billingForm: FormGroup;
  
  predefinedAmounts = [10, 25, 50, 100];
  
  constructor() {
    this.paymentForm = new FormGroup({
      cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
      cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
      expiryDate: new FormControl('', [Validators.required])
    });
    
    this.billingForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contactNumber: new FormControl('', [Validators.required])
    });
  }
  
  nextStep(): void {
    if (this.currentStep === 1 && !this.donationAmount) {
      return;
    }
    
    if (this.currentStep === 2 && this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      return;
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
  
  // Helper method to mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  submitDonation(): void {
    // Here you would typically send the data to your backend
    console.log('Donation submitted', {
      donationType: this.donationType,
      amount: this.donationAmount,
      message: this.donationMessage,
      payment: this.paymentForm.value,
      billing: this.billingForm.value
    });
    
    // Reset the form after submission
    this.currentStep = 1;
    this.donationAmount = null;
    this.customAmount = '';
    this.donationMessage = '';
    this.paymentForm.reset();
    this.billingForm.reset();
    
    alert('Thank you for your donation!');
  }
  
  goToMainSite(): void {
    // Typically this would navigate to your main site
    console.log('Navigating back to main site');
  }
}