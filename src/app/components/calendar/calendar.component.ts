import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import moment from 'moment';

export interface DateRangeOutput {
  startDate: Date;
  endDate: Date;
  label?: string; 
}

interface CalendarDay {
  date: moment.Moment;
  dayNumber: number;
  isToday: boolean;
  isSelected: boolean;
  inRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  otherMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  @Output() dateRangeChanged = new EventEmitter<DateRangeOutput>();
  startDate: moment.Moment;
  endDate: moment.Moment;
  
  currentDate: moment.Moment;
  
  isCalendarOpen: boolean = false;
  
  weekdays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  calendarDays: CalendarDay[] = [];
  nextMonthDays: CalendarDay[] = [];
  
  isSelectingRange: boolean = false;
  tempStartDate: moment.Moment | null = null;
  
  selectedRangeLabel: string = 'Últimos 7 días';
  
  constructor(private elementRef: ElementRef) {
    this.currentDate = moment().startOf('month');
    
    this.startDate = moment().subtract(6, 'days').startOf('day');
    this.endDate = moment().endOf('day');
    
    moment.locale('es');
  }

  ngOnInit(): void {
    this.generateCalendarDays();
    
    this.emitDateRange('Últimos 7 días');
  }
  
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (this.isCalendarOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isCalendarOpen = false;
    }
  }
  
  toggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
    
    if (this.isCalendarOpen) {
      this.generateCalendarDays();
      
      this.currentDate = moment(this.startDate).startOf('month');
      this.generateCalendarDays();
    }
  }
  
  formatSelectedRange(): string {
    if (this.startDate && this.endDate) {
      if (this.selectedRangeLabel && this.selectedRangeLabel !== 'Personalizado') {
        return this.selectedRangeLabel;
      } else {
        return `${this.startDate.format('DD/MM/YYYY')} - ${this.endDate.format('DD/MM/YYYY')}`;
      }
    }
    return 'Seleccionar fechas';
  }
  
  get currentMonthTitle(): string {
    return this.currentDate.format('MMM YYYY');
  }
  
  get nextMonthTitle(): string {
    return moment(this.currentDate).add(1, 'month').format('MMM YYYY');
  }
  
  generateCalendarDays(): void {
    this.calendarDays = this.generateMonthDays(this.currentDate);
    
    this.nextMonthDays = this.generateMonthDays(moment(this.currentDate).add(1, 'month'));
  }
  
  generateMonthDays(date: moment.Moment): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = moment().startOf('day');
    
    const startOfMonth = moment(date).startOf('month');
    
    let dayOfWeek = startOfMonth.day();
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const prevMonth = moment(startOfMonth).subtract(1, 'month');
    const daysInPrevMonth = prevMonth.daysInMonth();
    
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const day = moment(prevMonth).date(daysInPrevMonth - i);
      days.push(this.createCalendarDay(day, true));
    }
    
    const daysInMonth = startOfMonth.daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
      const day = moment(startOfMonth).date(i);
      days.push(this.createCalendarDay(day, false));
    }
    
    const remainingDays = 42 - days.length;
    
    const nextMonth = moment(startOfMonth).add(1, 'month');
    for (let i = 1; i <= remainingDays; i++) {
      const day = moment(nextMonth).date(i);
      days.push(this.createCalendarDay(day, true));
    }
    
    return days;
  }
  
  createCalendarDay(date: moment.Moment, otherMonth: boolean): CalendarDay {
    const today = moment().startOf('day');
    
    const isSelected = !otherMonth && (date.isSame(this.startDate, 'day') || date.isSame(this.endDate, 'day'));
    const inRange = !otherMonth && date.isBetween(this.startDate, this.endDate, 'day', '[]');
    const isRangeStart = !otherMonth && date.isSame(this.startDate, 'day');
    const isRangeEnd = !otherMonth && date.isSame(this.endDate, 'day');
    
    return {
      date: date,
      dayNumber: date.date(),
      isToday: date.isSame(today, 'day'),
      isSelected: isSelected,
      inRange: inRange,
      isRangeStart: isRangeStart,
      isRangeEnd: isRangeEnd,
      otherMonth: otherMonth
    };
  }
  
  prevMonth(event: MouseEvent): void {
    event.stopPropagation(); 
    this.currentDate = moment(this.currentDate).subtract(1, 'month');
    this.generateCalendarDays();
  }
  
  nextMonth(event: MouseEvent): void {
    event.stopPropagation();
    this.currentDate = moment(this.currentDate).add(1, 'month');
    this.generateCalendarDays();
  }
  
  selectDay(day: CalendarDay, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (day.otherMonth) {
      return;
    }
    
    if (!this.isSelectingRange) {
      this.tempStartDate = moment(day.date);
      this.isSelectingRange = true;
      
      this.startDate = moment(day.date).startOf('day');
      this.endDate = moment(day.date).endOf('day');
      this.selectedRangeLabel = 'Personalizado';
    } else {
      const tempEndDate = moment(day.date);
      
      if (tempEndDate.isBefore(this.tempStartDate)) {
        this.startDate = moment(tempEndDate).startOf('day');
        this.endDate = moment(this.tempStartDate).endOf('day');
      } else {
        this.startDate = moment(this.tempStartDate).startOf('day');
        this.endDate = moment(tempEndDate).endOf('day');
      }
      
      this.isSelectingRange = false;
      this.tempStartDate = null;
    }
    
    this.generateCalendarDays();
  }
  
  calendarClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  selectRange(rangeName: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    
    this.selectedRangeLabel = rangeName;
    this.isSelectingRange = false;
    this.tempStartDate = null;
    
    const now = moment();
    
    switch (rangeName) {
      case 'Hoy':
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        break;
      case 'Ayer':
        this.startDate = moment().subtract(1, 'days').startOf('day');
        this.endDate = moment().subtract(1, 'days').endOf('day');
        break;
      case 'Esta semana':
        this.startDate = moment().startOf('week');
        this.endDate = moment().endOf('week');
        break;
      case 'Últimos 7 días':
        this.startDate = moment().subtract(6, 'days').startOf('day');
        this.endDate = moment().endOf('day');
        break;
      case 'Últimos 30 días':
        this.startDate = moment().subtract(29, 'days').startOf('day');
        this.endDate = moment().endOf('day');
        break;
      case 'Este mes':
        this.startDate = moment().startOf('month');
        this.endDate = moment().endOf('month');
        break;
      case 'Mes pasado':
        this.startDate = moment().subtract(1, 'month').startOf('month');
        this.endDate = moment().subtract(1, 'month').endOf('month');
        break;
      case 'Este año':
        this.startDate = moment().startOf('year');
        this.endDate = moment().endOf('year');
        break;
      case 'Año pasado':
        this.startDate = moment().subtract(1, 'year').startOf('year');
        this.endDate = moment().subtract(1, 'year').endOf('year');
        break;
    }
    
    this.currentDate = moment(this.startDate).startOf('month');
    
    this.generateCalendarDays();
  }
  
  cancelSelection(event: MouseEvent): void {
    event.stopPropagation(); 
    this.isCalendarOpen = false;
  }
  
  applySelection(event: MouseEvent): void {
    event.stopPropagation();
    this.emitDateRange(this.selectedRangeLabel);
    this.isCalendarOpen = false;
  }
  
  private emitDateRange(label?: string): void {
    if (this.startDate && this.endDate) {
      const output: DateRangeOutput = {
        startDate: this.startDate.toDate(),
        endDate: this.endDate.toDate(),
        label: label === 'Personalizado' ? undefined : label
      };
      
      this.dateRangeChanged.emit(output);
    }
  }
}