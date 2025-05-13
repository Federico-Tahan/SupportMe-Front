import { Component, inject, OnInit } from '@angular/core';
import { PaymentDetailRead } from '../../../core/shared/interfaces/payment-detail-read';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/shared/services/payment.service';
import { CalendarComponent, DateRangeOutput } from "../../../components/calendar/calendar.component";
import { DateParserPipe } from '../../../core/shared/pipes/date-parser.pipe';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaymentFilter } from '../../../core/shared/interfaces/payment-filter';
import { InlineLoadingSpinnerComponent } from "../../../components/inline-loading-spinner/inline-loading-spinner.component";
import { RouterLink } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
  imports: [CommonModule, FormsModule, CalendarComponent, DateParserPipe, DatePipe, InlineLoadingSpinnerComponent, RouterLink],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit {
  endDate: Date = new Date();
  startDate: Date = new Date(new Date().setDate(this.endDate.getDate() - 7));  
  paymentService = inject(PaymentService);
  totalPayments: number = 0;
  successfulPayments: number = 0;
  errorPayments: number = 0;
  refundedPayments: number = 0;
  pendingPayments: number = 0;
  totalItems: number = 0;
  isLoading = false;

  totalHovered: boolean = false;
  successHovered: boolean = false;
  errorHovered: boolean = false;
  refundHovered: boolean = false;
  pendingHovered: boolean = false;
  
  searchText: string = '';
  private searchTextSubject = new Subject<string>();
  
  pageSize: number = 10;
  currentPage: number = 1;
  
  paymentFilter: PaymentFilter = {
    brand: [],
    campaignId: [],
    status: [],
    from: this.startDate,
    to: this.endDate,
    Limit: this.pageSize,
    skip: 0,
    textFilter: ''
  };
  
  filters: Filter[] = [
    {
      name: 'Tarjetas',
      options: [
        { label: 'VISA', value: 'visa', isActive: false },
        { label: 'MASTERCARD', value: 'mastercard', isActive: false }
      ],
      selectedOptions: []
    }
  ];
  
  payments: PaymentDetailRead[] = [];
  
  constructor() {
    this.searchTextSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(text => {
      this.paymentFilter.textFilter = text;
      this.loadPayments();
    });
  }
  
  ngOnInit(): void {
    this.loadPayments();
    this.loadCardBrands();
  }
  
  onDateRangeChange(dateRange: DateRangeOutput): void {
    this.startDate = dateRange.startDate;
    this.endDate = dateRange.endDate;
    
    this.paymentFilter.from = this.startDate;
    this.paymentFilter.to = this.endDate;
    
    this.loadPayments();
  }
  
  loadCardBrands(): void {
    this.filters[0].options = [
      { label: 'VISA', value: 'visa', isActive: false },
      { label: 'MASTERCARD', value: 'mastercard', isActive: false }
    ];
  }
  
  onSearch(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.searchTextSubject.next(text);
  }
  
  loadPayments(): void {
    this.paymentFilter.skip = (this.currentPage - 1) * this.pageSize;
    this.paymentFilter.Limit = this.pageSize;
    this.isLoading = true;

    this.paymentService.getPayments(this.paymentFilter).subscribe({
      next: (livefeedpayment) => {
        this.payments = livefeedpayment.items.items;
        this.totalPayments = livefeedpayment.totalRegisters;
        this.successfulPayments = livefeedpayment.totalOk;
        this.refundedPayments = livefeedpayment.totalRefunded;
        this.errorPayments = livefeedpayment.totalError;
        this.totalItems = livefeedpayment.totalRegisters;
        this.isLoading = false;

      },
      error: (err) => {
        console.error('Error al cargar pagos:', err);
        this.isLoading = false;
      }
    });
  }
  
  formatDateRange(start: Date, end: Date): string {
    return `${start.getDate()} abr, ${start.getFullYear()} - ${end.getDate()} abr, ${end.getFullYear()}`;
  }
  
  formatCurrency(amount: number): string {
    return amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadPayments();
  }
  
  goToFirstPage(): void {
    this.currentPage = 1;
    this.loadPayments();
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPayments();
    }
  }
  
  goToNextPage(): void {
    if (this.currentPage * this.pageSize < this.totalItems) {
      this.currentPage++;
      this.loadPayments();
    }
  }
  
  goToLastPage(): void {
    this.currentPage = Math.ceil(this.totalItems / this.pageSize);
    this.loadPayments();
  }
  
  toggleFilter(filterIndex: number, optionIndex: number): void {
    const option = this.filters[filterIndex].options[optionIndex];
    option.isActive = !option.isActive;
    
    this.filters[filterIndex].selectedOptions = this.filters[filterIndex].options
      .filter(opt => opt.isActive)
      .map(opt => opt.label);
      
    if (filterIndex === 0) {
      this.paymentFilter.brand = this.filters[0].options
        .filter(opt => opt.isActive)
        .map(opt => opt.value);
    }
    
    this.currentPage = 1;
    this.loadPayments();
  }
  
  hasActiveOptions(filterIndex: number): boolean {
    return this.filters[filterIndex].options.some(option => option.isActive);
  }
  
  getSelectedOptions(filterIndex: number): string {
    return this.filters[filterIndex].selectedOptions.join(', ');
  }
  
  activeStatusFilter: string | null = null;
  
  activeCardStyles = {
    'box-shadow': '0 0 0 2px #4a6cf7, 0 8px 16px rgba(0, 0, 0, 0.15)',
    'transform': 'translateY(-2px)',
    'border': '1px solid #4a6cf7'
  };
  
  openFilterIndex: number = -1;
  tempSelectedOptions: { [filterIndex: number]: boolean[] } = {};
  
  filterByStatus(status: string): void {
    if (status === this.activeStatusFilter) {
      this.activeStatusFilter = null;
      this.paymentFilter.status = [];
    } else {
      this.activeStatusFilter = status;
      
      if (status === 'ALL') {
        this.paymentFilter.status = [];
      } else {
        this.paymentFilter.status = [status];
      }
    }
    
    this.currentPage = 1;
    this.loadPayments();
  }
  
  applyMultipleFilterOptions(filterIndex: number, selectedValues: string[]): void {
    const filter = this.filters[filterIndex];
    
    filter.options.forEach(option => {
      option.isActive = selectedValues.includes(option.value);
    });
    
    filter.selectedOptions = filter.options
      .filter(opt => opt.isActive)
      .map(opt => opt.label);
    
   if (filterIndex === 0) {
      this.paymentFilter.brand = filter.options
        .filter(opt => opt.isActive)
        .map(opt => opt.value);
    }
    
    this.currentPage = 1;
    this.loadPayments();
  }
  
  toggleFilterDropdown(index: number): void {
    if (this.openFilterIndex === index) {
      this.openFilterIndex = -1;
    } else {
      this.openFilterIndex = index;
      this.tempSelectedOptions[index] = [...this.filters[index].options.map(opt => opt.isActive)];
    }
  }
  
  closeFilterDropdown(): void {
    if (this.openFilterIndex >= 0) {
      const filterIndex = this.openFilterIndex;
      
      this.filters[filterIndex].options.forEach(option => {
        option.isActive = false;
      });
      
      this.filters[filterIndex].selectedOptions = [];
      
     if (filterIndex === 0) {
        this.paymentFilter.brand = [];
      }
      
      delete this.tempSelectedOptions[filterIndex];
      
      this.currentPage = 1;
      this.loadPayments();
    }
    
    this.openFilterIndex = -1;
  }
  
  
  toggleOptionInDropdown(filterIndex: number, optionIndex: number): void {
    if (!this.tempSelectedOptions[filterIndex]) {
      this.tempSelectedOptions[filterIndex] = this.filters[filterIndex].options.map(opt => opt.isActive);
    }
    
    this.tempSelectedOptions[filterIndex][optionIndex] = !this.tempSelectedOptions[filterIndex][optionIndex];
  }
  
  applyFiltersFromDropdown(): void {
    if (this.openFilterIndex >= 0) {
      const filterIndex = this.openFilterIndex;
      
      if (this.tempSelectedOptions[filterIndex]) {
        this.filters[filterIndex].options.forEach((option, idx) => {
          option.isActive = this.tempSelectedOptions[filterIndex][idx];
        });
        
        this.filters[filterIndex].selectedOptions = this.filters[filterIndex].options
          .filter(opt => opt.isActive)
          .map(opt => opt.label);
        
        if (filterIndex === 0) {
          this.paymentFilter.brand = this.filters[filterIndex].options
            .filter(opt => opt.isActive)
            .map(opt => opt.value);
        }
        
        delete this.tempSelectedOptions[filterIndex];
      }
      
      this.currentPage = 1;
      this.loadPayments();
    }
    
    this.openFilterIndex = -1;
  }

  downloadExcel(): void {
    if (this.totalPayments === 0) {
      return;
    }
    
    this.isLoading = true;
    
    const downloadFilter: PaymentFilter = {
      ...this.paymentFilter,
      Limit: 100000,
      skip: 0
    };
    
    this.paymentService.getPayments(downloadFilter).subscribe({
      next: (livefeedpayment) => {
        this.generateExcel(livefeedpayment.items.items);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener datos para Excel:', err);
        this.isLoading = false;
      }
    });
  }
  
  private generateExcel(payments: PaymentDetailRead[]): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pagos');
    
    worksheet.columns = [
      { header: 'Importe', key: 'amount', width: 15 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Método de pago', key: 'paymentMethod', width: 20 },
      { header: 'Número de tarjeta', key: 'cardNumber', width: 20 },
      { header: 'Marca', key: 'brand', width: 15 },
      { header: 'Campaña', key: 'campaignName', width: 25 },
      { header: 'Cliente', key: 'customerName', width: 25 },
      { header: 'Fecha de transacción', key: 'paymentDate', width: 25 }
    ];
    
    worksheet.getRow(1).font = { bold: true };
    
    payments.forEach(payment => {
      worksheet.addRow({
        amount: `$${this.formatCurrency(payment.amount)} ARS`,
        status: payment.status,
        paymentMethod: 'Tarjeta',
        cardNumber: `•••• ${payment.last4}`,
        brand: payment.brand,
        campaignName: payment.campaign.name,
        customerName: payment.customerName,
        paymentDate: new Date(payment.paymentDate).toLocaleString()
      });
    });
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const statusCell = row.getCell(2);
        if (statusCell.value === 'OK') {
          statusCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6F7E9' }
          };
        } else if (statusCell.value === 'ERROR') {
          statusCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9E3E3' }
          };
        } else if (statusCell.value === 'REFUNDED') {
          statusCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9F3E3' }
          };
        }
      }
      
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });
    
    workbook.xlsx.writeBuffer().then(buffer => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const fileName = `Pagos_${formattedDate}.xlsx`;
      
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(blob, fileName);
    });
  }
}