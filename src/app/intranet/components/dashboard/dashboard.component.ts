import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CampaignDetailsComponent } from '../campaign-details/campaign-details.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';
import { CalendarComponent, DateRangeOutput } from '../../../components/calendar/calendar.component';
import { DashboardService } from '../../../core/shared/services/dashboard.service';
import { finalize, forkJoin } from 'rxjs';
import { Summary } from '../../../core/shared/interfaces/summary';
import { InlineLoadingSpinnerComponent } from '../../../components/inline-loading-spinner/inline-loading-spinner.component';
import { SimpleCampaign } from '../../../core/shared/interfaces/simple-campaign';

// KPI data interface
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
    KpiCardsComponent,
    CampaignDetailsComponent,
    CalendarComponent,
    InlineLoadingSpinnerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  // Date range parameters
  selectedDateRange: string = '30';
  startDate: string;
  endDate: string;
  
  // Selected campaign
  selectedCampaign: SimpleCampaign;
  
  // Service and change detection
  dashboardService = inject(DashboardService);
  cdr = inject(ChangeDetectorRef);
  
  // KPI data arrays
  kpiData: KpiData[] = [];
  filteredKpiData: KpiData[] = [];
  
  // Loading state
  loading: boolean = false;
  
  ngOnInit(): void {
    // Initialize with default values
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.startDate = this.formatDateForInput(thirtyDaysAgo);
    this.endDate = this.formatDateForInput(today);
    
    this.loadKpiData(this.startDate, this.endDate);
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
    // Create fallback objects with default values to prevent undefined errors
    const safeCurrent: Summary = current || {
      income: 0,
      donations: 0,
      avgIncome: 0,
      visit: 0
    };
    
    const safePrevious: Summary = previous || {
      income: 0,
      donations: 0,
      avgIncome: 0,
      visit: 0
    };
    
    // Ensure all properties are initialized to prevent undefined errors
    const currentIncome = safeCurrent.income || 0;
    const previousIncome = safePrevious.income || 0;
    const currentDonations = safeCurrent.donations || 0;
    const previousDonations = safePrevious.donations || 0;
    const currentAvgIncome = safeCurrent.avgIncome || 0;
    const previousAvgIncome = safePrevious.avgIncome || 0;
    const currentVisit = safeCurrent.visit || 0;
    const previousVisit = safePrevious.visit || 0;
    
    return [
      {
        title: 'Total Recaudado',
        value: this.formatCurrency(currentIncome),
        change: this.formatCurrency(previousIncome) + ' periodo anterior',
        isPositive: currentIncome >= previousIncome,
        originalValue: currentIncome
      },
      {
        title: 'Total Donaciones',
        value: currentDonations.toString(),
        change: previousDonations.toString() + ' periodo anterior',
        isPositive: currentDonations >= previousDonations,
        originalValue: currentDonations
      },
      {
        title: 'Donación Promedio',
        value: this.formatCurrency(currentAvgIncome),
        change: this.formatCurrency(previousAvgIncome) + ' periodo anterior',
        isPositive: currentAvgIncome >= previousAvgIncome,
        originalValue: currentAvgIncome
      },
      {
        title: 'Visitas',
        value: currentVisit.toString(),
        change: previousVisit.toString() + ' periodo anterior',
        isPositive: currentVisit >= previousVisit,
        originalValue: currentVisit
      }
    ];
  }
  
  initializeEmptyKpiData(): KpiData[] {
    const emptyData = [
      { title: 'Total Recaudado', value: '$0', change: '$0 periodo anterior', isPositive: false, originalValue: 0 },
      { title: 'Total Donaciones', value: '0', change: '0 periodo anterior', isPositive: false, originalValue: 0 },
      { title: 'Donación Promedio', value: '$0', change: '$0 periodo anterior', isPositive: false, originalValue: 0 },
      { title: 'Visitas', value: '0', change: '0 periodo anterior', isPositive: false, originalValue: 0 }
    ];
    
    this.kpiData = emptyData;
    this.filteredKpiData = [...emptyData];
    
    return emptyData;
  }
  
  onDateRangeChange(dateRange: DateRangeOutput): void {
    this.startDate = this.formatDateForInput(dateRange.startDate);
    this.endDate = this.formatDateForInput(dateRange.endDate);
    this.loadKpiData(this.startDate, this.endDate);
  }
  
  onCampaignChanged(campaign: SimpleCampaign): void {
    this.selectedCampaign = campaign;
    this.cdr.detectChanges();
  }
  
  private formatDateForInput(date: Date): string {
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dateWithoutTime.toISOString().split('T')[0];
  }
  
  private formatCurrency(value: number): string {
    // Check if value is undefined or null
    if (value === undefined || value === null) {
      return '$0';
    }
    
    return '$' + value.toLocaleString('en-US', { 
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2
    });
  }
}