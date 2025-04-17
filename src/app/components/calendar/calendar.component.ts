import { Component, EventEmitter, Input, Output } from '@angular/core';
interface CalendarDay {
  date: Date;
  day: number;
  differentMonth: boolean;
}
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  @Input() startDate: Date = new Date();
  @Input() endDate: Date = new Date();
  @Output() dateRangeChanged = new EventEmitter<{start: Date, end: Date}>();
  
  // Estado del componente
  isOpen = false;
  displayDateRange = '';
  activeOption: string | null = null;
  
  // Variables temporales
  tempStartDate: Date | null = null;
  tempEndDate: Date | null = null;
  
  // Variables del calendario
  currentViewMonth: Date = new Date();
  currentMonthLabel = '';
  nextMonthLabel = '';
  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  currentMonthDays: CalendarDay[] = [];
  nextMonthDays: CalendarDay[] = [];
  
  // Meses en español
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  constructor() { }
  
  ngOnInit(): void {
    // Inicializar fechas
    this.tempStartDate = new Date(this.startDate);
    this.tempEndDate = new Date(this.endDate);
    
    // Actualizar la etiqueta del rango
    this.updateDisplayDateRange();
    
    // Generar calendarios iniciales
    this.generateCalendars();
  }
  
  // Mostrar/ocultar el calendario
  toggleCalendar(): void {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      // Restablecer fechas temporales
      this.tempStartDate = new Date(this.startDate);
      this.tempEndDate = new Date(this.endDate);
      
      // Ajustar la vista del mes actual basado en la fecha de inicio
      this.currentViewMonth = new Date(this.startDate);
      
      // Generar calendarios
      this.generateCalendars();
    }
  }
  
  // Generar días para ambos calendarios
  generateCalendars(): void {
    // Configurar etiquetas de meses
    this.updateMonthLabels();
    
    // Generar días para el mes actual
    this.currentMonthDays = this.generateMonthDays(
      this.currentViewMonth.getFullYear(),
      this.currentViewMonth.getMonth()
    );
    
    // Generar días para el mes siguiente
    const nextMonth = new Date(this.currentViewMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.nextMonthDays = this.generateMonthDays(
      nextMonth.getFullYear(),
      nextMonth.getMonth()
    );
  }
  
  // Actualizar etiquetas de meses
  updateMonthLabels(): void {
    this.currentMonthLabel = `${this.months[this.currentViewMonth.getMonth()]} ${this.currentViewMonth.getFullYear()}`;
    
    const nextMonth = new Date(this.currentViewMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.nextMonthLabel = `${this.months[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`;
  }
  
  // Generar días para un mes específico
  generateMonthDays(year: number, month: number): CalendarDay[] {
    const days: CalendarDay[] = [];
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6; // Si es domingo (0), ajustar a 6
    
    // Días del mes anterior
    if (firstDayOfWeek > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const date = new Date(year, month - 1, day);
        days.push({
          date,
          day,
          differentMonth: true
        });
      }
    }
    
    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        day: i,
        differentMonth: false
      });
    }
    
    // Días del mes siguiente para completar la cuadrícula (42 celdas = 6 semanas * 7 días)
    const daysNeeded = 42 - days.length;
    for (let i = 1; i <= daysNeeded; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        day: i,
        differentMonth: true
      });
    }
    
    return days;
  }
  
  // Actualizar la etiqueta de rango mostrada
  updateDisplayDateRange(): void {
    if (!this.startDate || !this.endDate) {
      this.displayDateRange = 'Seleccionar fechas';
      return;
    }
    
    const formatDate = (date: Date) => {
      return `${date.getDate()} ${this.months[date.getMonth()].substring(0, 3)}, ${date.getFullYear()}`;
    };
    
    if (this.startDate.getTime() === this.endDate.getTime()) {
      this.displayDateRange = formatDate(this.startDate);
    } else {
      this.displayDateRange = `${formatDate(this.startDate)} - ${formatDate(this.endDate)}`;
    }
  }
  
  // Navegar al mes anterior
  prevMonth(): void {
    this.currentViewMonth.setMonth(this.currentViewMonth.getMonth() - 1);
    this.generateCalendars();
  }
  
  // Navegar al mes siguiente
  nextMonth(): void {
    this.currentViewMonth.setMonth(this.currentViewMonth.getMonth() + 1);
    this.generateCalendars();
  }
  
  // Seleccionar una fecha
  selectDate(date: Date): void {
    if (!date) return;
    
    // No permitir seleccionar fechas de meses diferentes
    const currentMonth = this.currentViewMonth.getMonth();
    const nextMonth = new Date(this.currentViewMonth);
    nextMonth.setMonth(currentMonth + 1);
    
    const dateMonth = date.getMonth();
    
    if (dateMonth !== currentMonth && dateMonth !== nextMonth.getMonth()) {
      return;
    }
    
    if (!this.tempStartDate || (this.tempStartDate && this.tempEndDate)) {
      // Iniciar nueva selección
      this.tempStartDate = new Date(date);
      this.tempEndDate = null;
      this.activeOption = null;
    } else if (this.tempStartDate && !this.tempEndDate) {
      // Completar selección
      if (date < this.tempStartDate) {
        this.tempEndDate = new Date(this.tempStartDate);
        this.tempStartDate = new Date(date);
      } else {
        this.tempEndDate = new Date(date);
      }
    }
  }
  
  // Verificar si un día está seleccionado (inicio o fin)
  isDaySelected(date: Date): boolean {
    if (!this.tempStartDate) return false;
    
    const isSameDate = (date1: Date, date2: Date) => {
      return date1.getDate() === date2.getDate() && 
             date1.getMonth() === date2.getMonth() && 
             date1.getFullYear() === date2.getFullYear();
    };
    
    return isSameDate(date, this.tempStartDate) || 
           (this.tempEndDate && isSameDate(date, this.tempEndDate));
  }
  
  // Verificar si es el inicio del rango
  isRangeStart(date: Date): boolean {
    if (!this.tempStartDate) return false;
    
    return date.getDate() === this.tempStartDate.getDate() && 
           date.getMonth() === this.tempStartDate.getMonth() && 
           date.getFullYear() === this.tempStartDate.getFullYear();
  }
  
  // Verificar si es el fin del rango
  isRangeEnd(date: Date): boolean {
    if (!this.tempEndDate) return false;
    
    return date.getDate() === this.tempEndDate.getDate() && 
           date.getMonth() === this.tempEndDate.getMonth() && 
           date.getFullYear() === this.tempEndDate.getFullYear();
  }
  
  // Verificar si una fecha está dentro del rango
  isInRange(date: Date): boolean {
    if (!this.tempStartDate || !this.tempEndDate) return false;
    
    const time = date.getTime();
    return time > this.tempStartDate.getTime() && time < this.tempEndDate.getTime();
  }
  
  // Verificar si es el día actual
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }
  
  // Aplicar la selección
  apply(): void {
    if (this.tempStartDate) {
      this.startDate = new Date(this.tempStartDate);
      
      if (this.tempEndDate) {
        this.endDate = new Date(this.tempEndDate);
      } else {
        // Si solo se seleccionó una fecha, usar la misma para inicio y fin
        this.endDate = new Date(this.tempStartDate);
      }
      
      this.updateDisplayDateRange();
      this.dateRangeChanged.emit({
        start: this.startDate,
        end: this.endDate
      });
      
      this.isOpen = false;
    }
  }
  
  // Cancelar la selección
  cancel(): void {
    this.tempStartDate = new Date(this.startDate);
    this.tempEndDate = new Date(this.endDate);
    this.isOpen = false;
  }
  
  // Seleccionar opción rápida
  selectQuickOption(option: string): void {
    this.activeOption = option;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (option) {
      case 'today':
        this.tempStartDate = new Date(today);
        this.tempEndDate = new Date(today);
        break;
        
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        this.tempStartDate = new Date(yesterday);
        this.tempEndDate = new Date(yesterday);
        break;
        
      case 'thisWeek':
        const thisWeekStart = new Date(today);
        const dayOfWeek = today.getDay() || 7; // 0 es domingo, lo convertimos a 7
        thisWeekStart.setDate(today.getDate() - dayOfWeek + 1); // Lunes de esta semana
        this.tempStartDate = new Date(thisWeekStart);
        this.tempEndDate = new Date(today);
        break;
        
      case 'lastWeek':
        const lastWeekEnd = new Date(today);
        const currentDayOfWeek = today.getDay() || 7;
        lastWeekEnd.setDate(today.getDate() - currentDayOfWeek); // Domingo de la semana anterior
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 6); // Lunes de la semana anterior
        this.tempStartDate = new Date(lastWeekStart);
        this.tempEndDate = new Date(lastWeekEnd);
        break;
        
      case 'thisMonth':
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        this.tempStartDate = new Date(thisMonthStart);
        this.tempEndDate = new Date(today);
        break;
        
      case 'lastMonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        this.tempStartDate = new Date(lastMonthStart);
        this.tempEndDate = new Date(lastMonthEnd);
        break;
        
      case 'thisYear':
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        this.tempStartDate = new Date(thisYearStart);
        this.tempEndDate = new Date(today);
        break;
        
      case 'lastYear':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        this.tempStartDate = new Date(lastYearStart);
        this.tempEndDate = new Date(lastYearEnd);
        break;
    }
    
    // Actualizar vista del calendario para mostrar el mes de inicio del rango
    if (this.tempStartDate) {
      this.currentViewMonth = new Date(this.tempStartDate);
      this.generateCalendars();
    }
  }
}
