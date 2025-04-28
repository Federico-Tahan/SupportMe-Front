import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CategoriesChartComponent } from '../categories-chart/categories-chart.component';
import { ChartsComponent } from '../charts/charts.component';
import { CampaignDetailsComponent } from '../campaign-details/campaign-details.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';
import { CalendarComponent, DateRangeOutput } from '../../../components/calendar/calendar.component';
import { DashboardService } from '../../../core/shared/services/dashboard.service';
import { finalize, forkJoin } from 'rxjs';
import { Summary } from '../../../core/shared/interfaces/summary';
import { InlineLoadingSpinnerComponent } from '../../../components/inline-loading-spinner/inline-loading-spinner.component';
import { CampaignDetailComponent } from "../../../public/components/campaign-detail/campaign-detail.component";

// Definir solo la interfaz KpiData que es la que necesitamos
interface KpiData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  originalValue?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule,
    ChartsComponent,
    KpiCardsComponent,
    CampaignDetailsComponent,
    CategoriesChartComponent,
    CalendarComponent,
    InlineLoadingSpinnerComponent,
    CampaignDetailComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  selectedDateRange: string = '30';
  startDate: string;
  endDate: string;
  
  dashboardService = inject(DashboardService);
  cdr = inject(ChangeDetectorRef);
  
  kpiData: KpiData[] = [];
  filteredKpiData: KpiData[] = [];
  
  loading: boolean = false;
  
  donationsChartData: any[] = [];
  visitsChartData: any[] = [];

  constructor() {}

  ngOnInit(): void {

  }

  loadKpiData(currentFromStr: string, currentToStr: string): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    const [currentStartYear, currentStartMonth, currentStartDay] = currentFromStr.split('-').map(Number);
    const [currentEndYear, currentEndMonth, currentEndDay] = currentToStr.split('-').map(Number);
    
    const currentStartDate = new Date(currentStartYear, currentStartMonth - 1, currentStartDay);
    const currentEndDate = new Date(currentEndYear, currentEndMonth - 1, currentEndDay);
  
    const dayDiff = Math.floor((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const periodDays = dayDiff + 1;
    
    const previousEndDate = new Date(currentStartDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    
    const previousStartDate = new Date(previousEndDate);
    if (periodDays > 1) {
      previousStartDate.setDate(previousStartDate.getDate() - (periodDays - 1));
    }
    
    const previousFromStr = this.formatDateForInput(previousStartDate);
    const previousToStr = this.formatDateForInput(previousEndDate);
    
    forkJoin({
      current: this.dashboardService.getSummary(currentFromStr, currentToStr),
      previous: this.dashboardService.getSummary(previousFromStr, previousToStr)
    }).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (result) => {
        const currentSummary = result.current;
        const previousSummary = result.previous;
        
        this.kpiData = this.calculateKpiData(currentSummary, previousSummary);
        this.filteredKpiData = [...this.kpiData];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading KPI data:', err);
        this.initializeEmptyKpiData();
        this.cdr.detectChanges();
      }
    });
  }
  calculateKpiData(current: Summary, previous: Summary): KpiData[] {
    return [
      {
        title: 'Total Recaudado',
        value: this.formatCurrency(current.income),
        change: this.formatCurrency(previous.income) + ' periodo anterior',
        isPositive: current.income >= previous.income,
        originalValue: current.income
      },
      {
        title: 'Total Donaciones',
        value: current.donations.toString(),
        change: previous.donations.toString() + ' periodo anterior',
        isPositive: current.donations >= previous.donations,
        originalValue: current.donations
      },
      {
        title: 'Donación Promedio',
        value: this.formatCurrency(current.avgIncome),
        change: this.formatCurrency(previous.avgIncome) + ' periodo anterior',
        isPositive: current.avgIncome >= previous.avgIncome,
        originalValue: current.avgIncome
      },
      {
        title: 'Visitas',
        value: current.visit.toString(),
        change: previous.visit.toString() + ' periodo anterior',
        isPositive: current.visit >= previous.visit,
        originalValue: current.visit
      }
    ];
  }
  

  initializeEmptyKpiData(): void {
    this.kpiData = [
      { title: 'Total Recaudado', value: '$0', change: '$0 periodo anterior', isPositive: false, originalValue: 0 },
      { title: 'Total Donaciones', value: '0', change: '0 periodo anterior', isPositive: false, originalValue: 0 },
      { title: 'Donación Promedio', value: '$0', change: '$0 periodo anterior', isPositive: false, originalValue: 0 },
      { title: 'Visitas', value: '0', change: '0 periodo anterior', isPositive: false, originalValue: 0 }
    ];
    this.filteredKpiData = [...this.kpiData];
  }
  

  onDateRangeChange(dateRange: DateRangeOutput): void {
    this.startDate = this.formatDateForInput(dateRange.startDate);
    this.endDate = this.formatDateForInput(dateRange.endDate);
    this.loadKpiData(this.startDate, this.endDate);
  }
  
  private formatDateForInput(date: Date): string {
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dateWithoutTime.toISOString().split('T')[0];
  }
  
  private formatCurrency(value: number): string {
    return '$' + value.toLocaleString('en-US', { 
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2
    });
  }
}