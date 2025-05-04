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
  startDate: Date = new Date(new Date().setDate(this.endDate.getDate() - 7)); // hace 7 días  
  paymentService = inject(PaymentService);
  totalPayments: number = 0;
  successfulPayments: number = 0;
  errorPayments: number = 0;
  refundedPayments: number = 0;
  pendingPayments: number = 0;
  totalItems: number = 0;
  isLoading = false;

  // Hover state variables for cards
  totalHovered: boolean = false;
  successHovered: boolean = false;
  errorHovered: boolean = false;
  refundHovered: boolean = false;
  pendingHovered: boolean = false;
  
  // Search text
  searchText: string = '';
  private searchTextSubject = new Subject<string>();
  
  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  
  // Filters state
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
  
  // Definición para los filtros
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
    // Setup debounced search
    this.searchTextSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(text => {
      this.paymentFilter.textFilter = text;
      this.loadPayments();
    });
  }
  
  ngOnInit(): void {
    // Cargar datos iniciales
    this.loadPayments();
    
    // Configurar opciones de tarjetas
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
    // Cargamos las tarjetas disponibles
    this.filters[1].options = [
      { label: 'VISA', value: 'visa', isActive: false },
      { label: 'MASTERCARD', value: 'mastercard', isActive: false }
    ];
  }
  
  onSearch(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.searchTextSubject.next(text);
  }
  
  loadPayments(): void {
    // Actualizar skip basado en paginación actual
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
    this.currentPage = 1; // Reset to first page when changing page size
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
      
    // Update filter values
    if (filterIndex === 1) { // Tarjetas
      this.paymentFilter.brand = this.filters[1].options
        .filter(opt => opt.isActive)
        .map(opt => opt.value);
    } else if (filterIndex === 0) { // Campañas
      this.paymentFilter.campaignId = this.filters[0].options
        .filter(opt => opt.isActive)
        .map(opt => parseInt(opt.value));
    }
    
    // Reset to first page when applying filters
    this.currentPage = 1;
    this.loadPayments();
  }
  
  hasActiveOptions(filterIndex: number): boolean {
    return this.filters[filterIndex].options.some(option => option.isActive);
  }
  
  getSelectedOptions(filterIndex: number): string {
    return this.filters[filterIndex].selectedOptions.join(', ');
  }
  
  // Variables para el estado de filtro activo
  activeStatusFilter: string | null = null;
  
  // Definiciones de los estilos CSS para la tarjeta activa
  activeCardStyles = {
    'box-shadow': '0 0 0 2px #4a6cf7, 0 8px 16px rgba(0, 0, 0, 0.15)',
    'transform': 'translateY(-2px)',
    'border': '1px solid #4a6cf7'
  };
  
  // Variables para mostrar dropdown de filtros
  openFilterIndex: number = -1;
  tempSelectedOptions: { [filterIndex: number]: boolean[] } = {};
  
  // Método para filtrar por estado al hacer clic en las tarjetas
  filterByStatus(status: string): void {
    // Si el status es el mismo que ya está activo, lo desactivamos
    if (status === this.activeStatusFilter) {
      this.activeStatusFilter = null;
      this.paymentFilter.status = [];
    } else {
      this.activeStatusFilter = status;
      
      if (status === 'ALL') {
        // Si se selecciona "Total", eliminamos cualquier filtro de estado
        this.paymentFilter.status = [];
      } else {
        // Aplicamos el filtro de estado seleccionado
        this.paymentFilter.status = [status];
      }
    }
    
    // Reset a primera página y cargar datos
    this.currentPage = 1;
    this.loadPayments();
  }
  
  // Método para aplicar múltiples selecciones de filtro a la vez
  applyMultipleFilterOptions(filterIndex: number, selectedValues: string[]): void {
    const filter = this.filters[filterIndex];
    
    // Actualizar estado de las opciones
    filter.options.forEach(option => {
      option.isActive = selectedValues.includes(option.value);
    });
    
    // Actualizar lista de opciones seleccionadas
    filter.selectedOptions = filter.options
      .filter(opt => opt.isActive)
      .map(opt => opt.label);
    
    // Actualizar el filtro según el tipo
    if (filterIndex === 0) { // Campañas
      this.paymentFilter.campaignId = filter.options
        .filter(opt => opt.isActive)
        .map(opt => parseInt(opt.value));
    } else if (filterIndex === 1) { // Tarjetas
      this.paymentFilter.brand = filter.options
        .filter(opt => opt.isActive)
        .map(opt => opt.value);
    }
    
    // Reset a primera página y cargar datos
    this.currentPage = 1;
    this.loadPayments();
  }
  
  // Variables para el dropdown de filtros
  
  toggleFilterDropdown(index: number): void {
    if (this.openFilterIndex === index) {
      this.openFilterIndex = -1; // Cerrar si ya está abierto
    } else {
      this.openFilterIndex = index; // Abrir el dropdown
      // Inicializar tempSelectedOptions con los valores actuales
      this.tempSelectedOptions[index] = [...this.filters[index].options.map(opt => opt.isActive)];
    }
  }
  
  closeFilterDropdown(): void {
    // Borrar todas las selecciones
    if (this.openFilterIndex >= 0) {
      const filterIndex = this.openFilterIndex;
      
      // Desactivar todas las opciones del filtro actual
      this.filters[filterIndex].options.forEach(option => {
        option.isActive = false;
      });
      
      // Limpiar las opciones seleccionadas
      this.filters[filterIndex].selectedOptions = [];
      
      // Actualizar los valores de filtro según el tipo
      if (filterIndex === 0) { // Campañas
        this.paymentFilter.campaignId = [];
      } else if (filterIndex === 1) { // Tarjetas
        this.paymentFilter.brand = [];
      }
      
      // Limpiar las selecciones temporales
      delete this.tempSelectedOptions[filterIndex];
      
      // Actualizar datos
      this.currentPage = 1;
      this.loadPayments();
    }
    
    // Cerrar el dropdown
    this.openFilterIndex = -1;
  }
  
  
  toggleOptionInDropdown(filterIndex: number, optionIndex: number): void {
    // Si no existe la entrada para este filtro, la creamos
    if (!this.tempSelectedOptions[filterIndex]) {
      // Inicializar con el estado actual de las opciones
      this.tempSelectedOptions[filterIndex] = this.filters[filterIndex].options.map(opt => opt.isActive);
    }
    
    // Toggle el estado
    this.tempSelectedOptions[filterIndex][optionIndex] = !this.tempSelectedOptions[filterIndex][optionIndex];
  }
  
  applyFiltersFromDropdown(): void {
    if (this.openFilterIndex >= 0) {
      const filterIndex = this.openFilterIndex;
      
      // Si tenemos cambios guardados para este filtro
      if (this.tempSelectedOptions[filterIndex]) {
        // Aplicar cambios al estado de las opciones
        this.filters[filterIndex].options.forEach((option, idx) => {
          option.isActive = this.tempSelectedOptions[filterIndex][idx];
        });
        
        // Actualizar valores seleccionados
        this.filters[filterIndex].selectedOptions = this.filters[filterIndex].options
          .filter(opt => opt.isActive)
          .map(opt => opt.label);
        
        // Actualizar filtros según el tipo
        if (filterIndex === 0) { // Campañas
          this.paymentFilter.campaignId = this.filters[filterIndex].options
            .filter(opt => opt.isActive)
            .map(opt => parseInt(opt.value));
        } else if (filterIndex === 1) { // Tarjetas
          this.paymentFilter.brand = this.filters[filterIndex].options
            .filter(opt => opt.isActive)
            .map(opt => opt.value);
        }
        
        // Limpiar el estado temporal
        delete this.tempSelectedOptions[filterIndex];
      }
      
      // Cargar datos con los nuevos filtros
      this.currentPage = 1;
      this.loadPayments();
    }
    
    // Cerrar el dropdown
    this.openFilterIndex = -1;
  }
}