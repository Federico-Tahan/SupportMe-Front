import { Component, inject } from '@angular/core';
import { PaymentDetailRead } from '../../../core/shared/interfaces/payment-detail-read';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/shared/services/payment.service';
interface FilterOption {
  label: string;
  value: string;
  isActive: boolean;
}

interface Filter {
  name: string;
  options: FilterOption[];
  selectedOptions: string[];
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {
  startDate: Date = new Date(2025, 3, 9); // April 9, 2025
  endDate: Date = new Date(2025, 3, 16); // April 16, 2025
  paymentService = inject(PaymentService);
  totalPayments: number = 0;
  successfulPayments: number = 0;
  errorPayments: number = 0;
  refundedPayments: number = 0;
  pendingPayments: number = 0;
  
  // Hover state variables for cards
  totalHovered: boolean = false;
  successHovered: boolean = false;
  errorHovered: boolean = false;
  refundHovered: boolean = false;
  pendingHovered: boolean = false;
  
  pageSize: number = 10;
  currentPage: number = 1;
  
  // Definición para los filtros
  filters: Filter[] = [
    {
      name: 'Campaña',
      options: [
        { label: 'Opción 1', value: 'opt1', isActive: false },
        { label: 'Opción 2', value: 'opt2', isActive: false }
      ],
      selectedOptions: []
    },
    {
      name: 'Tarjetas',
      options: [
        { label: 'Visa', value: 'visa', isActive: false },
        { label: 'Mastercard', value: 'mastercard', isActive: false }
      ],
      selectedOptions: []
    }
  ];
  
  payments: PaymentDetailRead[] = [
  ];
  
  constructor() {}
  
  ngOnInit(): void {
    this.paymentService.payments().subscribe(
      {
        next: (data) => 
          {
            this.payments = data.items.items;
            this.totalPayments = data.totalRegisters;
            this.successfulPayments = data.totalOk;
            this.refundedPayments = data.totalRefunded;
            this.errorPayments = data.totalError;
          }
      })
  }
  
  formatDateRange(start: Date, end: Date): string {
    return `${start.getDate()} abr, ${start.getFullYear()} - ${end.getDate()} abr, ${end.getFullYear()}`;
  }
  
  formatCurrency(amount: number): string {
    return amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
  }
  
  toggleFilter(filterIndex: number, optionIndex: number): void {
    const option = this.filters[filterIndex].options[optionIndex];
    option.isActive = !option.isActive;
    
    this.filters[filterIndex].selectedOptions = this.filters[filterIndex].options
      .filter(opt => opt.isActive)
      .map(opt => opt.label);
  }
  
  hasActiveOptions(filterIndex: number): boolean {
    return this.filters[filterIndex].options.some(option => option.isActive);
  }
  
  getSelectedOptions(filterIndex: number): string {
    return this.filters[filterIndex].selectedOptions.join(', ');
  }
}
