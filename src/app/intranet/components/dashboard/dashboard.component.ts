import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CategoriesChartComponent } from '../categories-chart/categories-chart.component';
import { ChartsComponent } from '../charts/charts.component';
import { CampaignDetailsComponent } from '../campaign-details/campaign-details.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';
import { CalendarComponent, DateRangeOutput } from '../../../components/calendar/calendar.component';

interface Campaign {
  name: string;
  raised: string;
  goal: string;
  donors: string;
  daysLeft: string;
  percentage: string;
  donations: number[];
  visits: number[];
  // Nuevos campos para el filtro
  filteredDonations?: number[];
  filteredVisits?: number[];
  // Fechas para cada dato mensual (para filtrado por fecha)
  donationDates?: Date[];
}

interface Category {
  name: string;
  icon: string;
  iconBg: string;
  raised: string;
  goal: string;
  percentage: number;
  progressColor: string;
  // Para mantener valores originales durante el filtrado
  originalRaised?: number;
  originalGoal?: number;
}

interface KpiData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  // Para mantener valores originales durante el filtrado
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
    CalendarComponent  
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  // Propiedades para el filtro de fecha
  selectedDateRange: string = '30'; // Default a 30 días
  startDate: string;
  endDate: string;
  today: string;
  
  // Datos originales (sin filtrar)
  kpiData: KpiData[] = [
    { title: 'Total Recaudado', value: '$125,480', change: '+12.5% vs mes anterior', isPositive: true, originalValue: 125480 },
    { title: 'Campañas Activas', value: '8', change: '+2 vs mes anterior', isPositive: true, originalValue: 8 },
    { title: 'Total Donaciones', value: '1,254', change: '+18.3% vs mes anterior', isPositive: true, originalValue: 1254 },
    { title: 'Donación Promedio', value: '$100.06', change: '-5.2% vs mes anterior', isPositive: false, originalValue: 100.06 }
  ];

  // Datos filtrados (que se muestran)
  filteredKpiData: KpiData[] = [...this.kpiData];

  campaigns: Campaign[] = [
    {
      name: 'Educación para Todos',
      raised: '$42,580',
      goal: '$50,000',
      donors: '426',
      daysLeft: '42',
      percentage: '85%',
      donations: [5200, 8350, 9800, 12230, 7000, 8500, 10200, 9700, 11500, 10800, 12300, 11000],
      visits: [1200, 1900, 2300, 2800, 2100, 2400, 2700, 2500, 2900, 2600, 3100, 2800],
      filteredDonations: [],
      filteredVisits: [],
      donationDates: this.generateMonthlyDates()
    },
    {
      name: 'Agua Limpia',
      raised: '$28,350',
      goal: '$30,000',
      donors: '315',
      daysLeft: '28',
      percentage: '94%',
      donations: [3800, 5600, 7200, 6500, 5250, 5800, 6700, 6300, 7500, 7200, 8100, 7800],
      visits: [900, 1500, 1800, 1600, 1300, 1450, 1700, 1550, 1850, 1750, 2050, 1950],
      filteredDonations: [],
      filteredVisits: [],
      donationDates: this.generateMonthlyDates()
    },
    {
      name: 'Reconstrucción',
      raised: '$18,750',
      goal: '$20,000',
      donors: '210',
      daysLeft: '21',
      percentage: '93%',
      donations: [2500, 3800, 4200, 4500, 3750, 3900, 4100, 3800, 4300, 4200, 4600, 4400],
      visits: [700, 1200, 1400, 1500, 1100, 1250, 1350, 1200, 1450, 1400, 1600, 1500],
      filteredDonations: [],
      filteredVisits: [],
      donationDates: this.generateMonthlyDates()
    },
    {
      name: 'Alimentos Solidarios',
      raised: '$15,300',
      goal: '$15,000',
      donors: '168',
      daysLeft: '14',
      percentage: '102%',
      donations: [2100, 3200, 3800, 3500, 2700, 2800, 3000, 2900, 3300, 3200, 3600, 3400],
      visits: [600, 1000, 1200, 1100, 900, 950, 1100, 1050, 1250, 1200, 1350, 1300],
      filteredDonations: [],
      filteredVisits: [],
      donationDates: this.generateMonthlyDates()
    },
    {
      name: 'Refugio Temporal',
      raised: '$12,500',
      goal: '$12,000',
      donors: '145',
      daysLeft: '7',
      percentage: '104%',
      donations: [1800, 2600, 3000, 2900, 2200, 2300, 2500, 2400, 2800, 2700, 3100, 2900],
      visits: [500, 800, 1000, 900, 700, 750, 900, 850, 1050, 1000, 1150, 1100],
      filteredDonations: [],
      filteredVisits: [],
      donationDates: this.generateMonthlyDates()
    },
    {
      name: 'Salud para Niños',
      raised: '$8,000',
      goal: '$10,000',
      donors: '95',
      daysLeft: '35',
      percentage: '80%',
      donations: [1500, 1800, 2200, 1500, 1000, 1100, 1300, 1200, 1400, 1300, 1700, 1600],
      visits: [400, 500, 700, 500, 300, 350, 450, 400, 500, 450, 600, 550],
      filteredDonations: [],
      filteredVisits: [],
      donationDates: this.generateMonthlyDates()
    }
  ];

  // Crear copia para datos filtrados
  filteredCampaigns: Campaign[] = this.campaigns.map(campaign => ({
    ...campaign,
    filteredDonations: [...campaign.donations],
    filteredVisits: [...campaign.visits]
  }));

  categories: Category[] = [
    {
      name: 'Educación',
      icon: '📚',
      iconBg: '#4361ee',
      raised: '$57,580',
      goal: '$65,000',
      percentage: 88,
      progressColor: '#4361ee',
      originalRaised: 57580,
      originalGoal: 65000
    },
    {
      name: 'Agua y Saneamiento',
      icon: '💧',
      iconBg: '#4361ee',
      raised: '$28,350',
      goal: '$30,000',
      percentage: 94,
      progressColor: '#4361ee',
      originalRaised: 28350,
      originalGoal: 30000
    },
    {
      name: 'Infraestructura',
      icon: '🏗️',
      iconBg: '#4361ee',
      raised: '$18,750',
      goal: '$20,000',
      percentage: 93,
      progressColor: '#4361ee',
      originalRaised: 18750,
      originalGoal: 20000
    },
    {
      name: 'Alimentación',
      icon: '🍎',
      iconBg: '#4361ee',
      raised: '$15,300',
      goal: '$15,000',
      percentage: 102,
      progressColor: '#4361ee',
      originalRaised: 15300,
      originalGoal: 15000
    }
  ];

  // Copia para datos filtrados
  filteredCategories: Category[] = [...this.categories];

  selectedCampaign: Campaign;
  donationsChartData: any[] = [];
  visitsChartData: any[] = [];

  constructor() {
    this.selectedCampaign = this.campaigns[0];
    
    // Inicializar fechas
    const now = new Date();
    this.today = this.formatDateForInput(now);
    
    // Configurar fecha de inicio por defecto (30 días atrás)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    this.startDate = this.formatDateForInput(thirtyDaysAgo);
    this.endDate = this.today;
  }

  ngOnInit(): void {
    // Inicializar datos filtrados
    this.applyDateFilter();
    this.prepareChartData();
  }

  onCampaignChange(campaign: Campaign): void {
    this.selectedCampaign = this.filteredCampaigns.find(c => c.name === campaign.name) || campaign;
    this.prepareChartData();
  }

  onDateRangeChange(dateRange: DateRangeOutput): void {
    // Actualizar las fechas de inicio y fin con los valores del calendario
    this.startDate = this.formatDateForInput(dateRange.startDate);
    this.endDate = this.formatDateForInput(dateRange.endDate);
    
    // Aplicar el filtro con las nuevas fechas
    this.applyDateFilter();
  }
  
  // Método para manejar cambios en las fechas personalizadas
  onCustomDateChange(): void {
    this.applyDateFilter();
  }
  
  // Aplicar filtro por fecha a todos los datos
  applyDateFilter(): void {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    endDate.setHours(23, 59, 59, 999); // Incluir todo el día final
    
    // Aplicar filtro a campañas
    this.filteredCampaigns = this.campaigns.map(campaign => {
      // Filtrar donaciones y visitas por fecha
      const filteredData = this.filterDataByDateRange(
        campaign.donations, 
        campaign.visits, 
        campaign.donationDates || this.generateMonthlyDates(),
        startDate, 
        endDate
      );
      
      // Calcular nuevos totales para la campaña
      const totalDonations = filteredData.donations.reduce((sum, val) => sum + val, 0);
      const totalGoal = this.extractNumber(campaign.goal);
      const percentage = Math.round((totalDonations / totalGoal) * 100);
      
      return {
        ...campaign,
        filteredDonations: filteredData.donations,
        filteredVisits: filteredData.visits,
        raised: this.formatCurrency(totalDonations),
        percentage: percentage + '%'
      };
    });
    
    // Actualizar campaña seleccionada
    this.selectedCampaign = this.filteredCampaigns.find(
      c => c.name === this.selectedCampaign.name
    ) || this.filteredCampaigns[0];
    
    // Aplicar filtro a categorías
    this.filteredCategories = this.categories.map(category => {
      // Aplicar un factor de reducción basado en el rango de fecha seleccionado
      const dateRangeFactor = this.calculateDateRangeFactor(startDate, endDate);
      const filteredRaised = Math.round(category.originalRaised! * dateRangeFactor);
      const percentage = Math.round((filteredRaised / category.originalGoal!) * 100);
      
      return {
        ...category,
        raised: this.formatCurrency(filteredRaised),
        percentage: percentage
      };
    });
    
    // Aplicar filtro a KPIs
    this.filteredKpiData = this.kpiData.map(kpi => {
      // Ajustar valores basados en el rango de fecha
      const dateRangeFactor = this.calculateDateRangeFactor(startDate, endDate);
      let filteredValue = kpi.originalValue! * dateRangeFactor;
      
      // Formato especial para moneda vs números
      let formattedValue;
      if (kpi.title.includes('Recaudado') || kpi.title.includes('Promedio')) {
        formattedValue = this.formatCurrency(filteredValue);
      } else {
        formattedValue = Math.round(filteredValue).toString();
      }
      
      return {
        ...kpi,
        value: formattedValue
      };
    });
    
    this.prepareChartData();
  }
  
  // Filtrar datos por rango de fecha
  filterDataByDateRange(
    donations: number[], 
    visits: number[], 
    dates: Date[],
    startDate: Date, 
    endDate: Date
  ): { donations: number[], visits: number[] } {
    const filteredDonations: number[] = [];
    const filteredVisits: number[] = [];
    
    dates.forEach((date, index) => {
      if (date >= startDate && date <= endDate) {
        filteredDonations.push(donations[index]);
        filteredVisits.push(visits[index]);
      } else {
        // Mantener el índice con valores cero para preservar la estructura
        filteredDonations.push(0);
        filteredVisits.push(0);
      }
    });
    
    return { donations: filteredDonations, visits: filteredVisits };
  }
  
  // Calcular factor de ajuste basado en el rango de fecha
  calculateDateRangeFactor(startDate: Date, endDate: Date): number {
    const totalDays = 365; // Base anual
    const selectedDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return selectedDays / totalDays;
  }

  // Preparar datos para las gráficas
  private prepareChartData(): void {
    // Usar datos filtrados en lugar de los originales
    this.donationsChartData = this.getChartData(this.selectedCampaign.filteredDonations || this.selectedCampaign.donations);
    this.visitsChartData = this.getChartData(this.selectedCampaign.filteredVisits || this.selectedCampaign.visits);
  }

  getChartData(dataArray: number[]): any[] {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, i) => ({
      name: month,
      value: dataArray[i] || 0 // Asegura que no haya valores undefined
    }));
  }
  
  // Métodos de utilidad
  
  // Generar fechas mensuales para el año actual
  private generateMonthlyDates(): Date[] {
    const dates: Date[] = [];
    const currentYear = new Date().getFullYear();
    
    for (let month = 0; month < 12; month++) {
      dates.push(new Date(currentYear, month, 15)); // Día 15 de cada mes
    }
    
    return dates;
  }
  
  // Formatear fecha para input HTML
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  // Extraer número de un string con formato de moneda
  private extractNumber(value: string): number {
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
  }
  
  // Formatear número como moneda
  private formatCurrency(value: number): string {
    return '$' + value.toLocaleString('en-US', { 
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2
    });
  }
}