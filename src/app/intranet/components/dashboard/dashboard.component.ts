import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CategoriesChartComponent } from '../categories-chart/categories-chart.component';
import { ChartsComponent } from '../charts/charts.component';
import { CampaignDetailsComponent } from '../campaign-details/campaign-details.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';

interface Campaign {
  name: string;
  raised: string;
  goal: string;
  donors: string;
  daysLeft: string;
  percentage: string;
  donations: number[];
  visits: number[];
}

interface Category {
  name: string;
  icon: string;
  iconBg: string;
  raised: string;
  goal: string;
  percentage: number;
  progressColor: string;
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
    CategoriesChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  kpiData = [
    { title: 'Total Recaudado', value: '$125,480', change: '+12.5% vs mes anterior', isPositive: true },
    { title: 'Campañas Activas', value: '8', change: '+2 vs mes anterior', isPositive: true },
    { title: 'Total Donaciones', value: '1,254', change: '+18.3% vs mes anterior', isPositive: true },
    { title: 'Donación Promedio', value: '$100.06', change: '-5.2% vs mes anterior', isPositive: false }
  ];

  campaigns: Campaign[] = [
    {
      name: 'Educación para Todos',
      raised: '$42,580',
      goal: '$50,000',
      donors: '426',
      daysLeft: '42',
      percentage: '85%',
      donations: [5200, 8350, 9800, 12230, 7000, 8500, 10200, 9700, 11500, 10800, 12300, 11000],
      visits: [1200, 1900, 2300, 2800, 2100, 2400, 2700, 2500, 2900, 2600, 3100, 2800]
    },
    {
      name: 'Agua Limpia',
      raised: '$28,350',
      goal: '$30,000',
      donors: '315',
      daysLeft: '28',
      percentage: '94%',
      donations: [3800, 5600, 7200, 6500, 5250, 5800, 6700, 6300, 7500, 7200, 8100, 7800],
      visits: [900, 1500, 1800, 1600, 1300, 1450, 1700, 1550, 1850, 1750, 2050, 1950]
    },
    {
      name: 'Reconstrucción',
      raised: '$18,750',
      goal: '$20,000',
      donors: '210',
      daysLeft: '21',
      percentage: '93%',
      donations: [2500, 3800, 4200, 4500, 3750, 3900, 4100, 3800, 4300, 4200, 4600, 4400],
      visits: [700, 1200, 1400, 1500, 1100, 1250, 1350, 1200, 1450, 1400, 1600, 1500]
    },
    {
      name: 'Alimentos Solidarios',
      raised: '$15,300',
      goal: '$15,000',
      donors: '168',
      daysLeft: '14',
      percentage: '102%',
      donations: [2100, 3200, 3800, 3500, 2700, 2800, 3000, 2900, 3300, 3200, 3600, 3400],
      visits: [600, 1000, 1200, 1100, 900, 950, 1100, 1050, 1250, 1200, 1350, 1300]
    },
    {
      name: 'Refugio Temporal',
      raised: '$12,500',
      goal: '$12,000',
      donors: '145',
      daysLeft: '7',
      percentage: '104%',
      donations: [1800, 2600, 3000, 2900, 2200, 2300, 2500, 2400, 2800, 2700, 3100, 2900],
      visits: [500, 800, 1000, 900, 700, 750, 900, 850, 1050, 1000, 1150, 1100]
    },
    {
      name: 'Salud para Niños',
      raised: '$8,000',
      goal: '$10,000',
      donors: '95',
      daysLeft: '35',
      percentage: '80%',
      donations: [1500, 1800, 2200, 1500, 1000, 1100, 1300, 1200, 1400, 1300, 1700, 1600],
      visits: [400, 500, 700, 500, 300, 350, 450, 400, 500, 450, 600, 550]
    }
  ];

  categories: Category[] = [
    {
      name: 'Educación',
      icon: '📚',
      iconBg: '#4361ee',
      raised: '$57,580',
      goal: '$65,000',
      percentage: 88,
      progressColor: '#4361ee',
    },
    {
      name: 'Agua y Saneamiento',
      icon: '💧',
      iconBg: '#4361ee',
      raised: '$28,350',
      goal: '$30,000',
      percentage: 94,
      progressColor: '#4361ee',
    },
    {
      name: 'Infraestructura',
      icon: '🏗️',
      iconBg: '#4361ee',
      raised: '$18,750',
      goal: '$20,000',
      percentage: 93,
      progressColor: '#4361ee',
    },
    {
      name: 'Alimentación',
      icon: '🍎',
      iconBg: '#4361ee',
      raised: '$15,300',
      goal: '$15,000',
      percentage: 102,
      progressColor: '#4361ee',
    }
  ];

  selectedCampaign: Campaign;
  donationsChartData: any[] = [];
  visitsChartData: any[] = [];

  constructor() {
    this.selectedCampaign = this.campaigns[0];
  }

  ngOnInit(): void {
    this.prepareChartData();
  }

  onCampaignChange(campaign: Campaign): void {
    this.selectedCampaign = campaign;
    this.prepareChartData();
  }

  private prepareChartData(): void {
    this.donationsChartData = this.getChartData(this.selectedCampaign.donations);
    this.visitsChartData = this.getChartData(this.selectedCampaign.visits);
  }

  getChartData(dataArray: number[]): any[] {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, i) => ({
      name: month,
      value: dataArray[i] || 0 // Asegura que no haya valores undefined
    }));
  }
}