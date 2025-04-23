import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface KpiItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-cards.component.html',
  styleUrls: ['./kpi-cards.component.scss']
})
export class KpiCardsComponent {
  @Input() kpiData: KpiItem[] = [];
}