import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../../../core/shared/services/dashboard.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() campaignId: number = null;
  @Input() from: string = null;
  @Input() to: string = null;
  
  donationsData: any[] = [];
  visitsData: any[] = [];
  
  processedDonationsData: any[] = [];
  processedVisitsData: any[] = [];
  
  view: [number, number] = [null, null];
  
  colorScheme: Color = {
    name: 'donationColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4361ee']
  };
  
  colorScheme2: Color = {
    name: 'visitColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#7209b7']
  };
  
  curve = shape.curveMonotoneX;
  
  dashboardService = inject(DashboardService);
  cdr = inject(ChangeDetectorRef);
  
  ngOnInit() {
    this.fetchData();
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['campaignId'] || changes['from'] || changes['to'])) {
      this.fetchData();
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  }
  
  private fetchData(): void {
    if (!this.campaignId || !this.from || !this.to) {
      // Reset data if parameters are missing
      this.donationsData = [];
      this.visitsData = [];
      this.processedDonationsData = [];
      this.processedVisitsData = [];
      this.cdr.detectChanges();
      return;
    }
    
    forkJoin({
      donations: this.dashboardService.getGraphIncome(this.from, this.to, this.campaignId),
      visits: this.dashboardService.getGraphVisit(this.from, this.to, this.campaignId)
    }).subscribe({
      next: (result) => {
        // Check if items property exists, otherwise use the result directly
        this.donationsData = result.donations.items || [];
        this.visitsData = result.visits.items || [];
        
        this.processData();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching chart data:', err);
        // Reset data on error
        this.donationsData = [];
        this.visitsData = [];
        this.processedDonationsData = [];
        this.processedVisitsData = [];
        this.cdr.detectChanges();
      }
    });
  }
  
  private processData(): void {
    this.processVisitsData();
    this.processDonationsData();
  }
  
  private processVisitsData(): void {
    if (!this.visitsData?.length) {
      this.processedVisitsData = [];
      return;
    }
    
    // Check the first item to determine the property name structure
    const sampleItem = this.visitsData[0];
    const nameKey = sampleItem.name !== undefined ? 'name' : 
                   (sampleItem.key !== undefined ? 'key' : null);
    
    if (!nameKey) {
      this.processedVisitsData = [];
      return;
    }
    
    // Para el gráfico de líneas, necesitamos un formato anidado
    this.processedVisitsData = [{
      name: 'Visitas',
      series: this.visitsData.map(item => ({
        name: item[nameKey] || '',
        value: item.value || 0
      }))
    }];
  }
  
  private processDonationsData(): void {
    if (!this.donationsData?.length) {
      this.processedDonationsData = [];
      return;
    }
    
    // Check the first item to determine the property name structure
    const sampleItem = this.donationsData[0];
    const nameKey = sampleItem.name !== undefined ? 'name' : 
                   (sampleItem.key !== undefined ? 'key' : null);
    
    if (!nameKey) {
      this.processedDonationsData = [];
      return;
    }
    
    // Para el gráfico de barras verticales, necesitamos un formato simple
    this.processedDonationsData = this.donationsData.map(item => ({
      name: item[nameKey] || '',
      value: item.value || 0
    }));
  }
    
  onSelect(event: any) {
    console.log(event);
  }
}