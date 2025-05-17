import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'app-categories-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-chart.component.html',
  styleUrl: './categories-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesChartComponent {
  @Input() categories: Category[] = [];
  
  trackByName(index: number, item: Category): string {
    return item.name;
  }
}