import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() donationsData: any[] = [];
  @Input() visitsData: any[] = [];
  
  // Process for line chart format
  processedVisitsData: any[] = [];
  
  // Set to null to force resize
  view: [number, number] = [null, null];
  
  colorScheme: Color = {
    name: 'donationColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4361ee', '#3a0ca3', '#7209b7', '#4cc9f0']
  };

  colorScheme2: Color = {
    name: 'visitColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#7209b7']
  };
  
  // Use d3-shape curve
  curve = shape.curveMonotoneX;
  
  constructor() {}
  
  ngOnInit() {
    this.processVisitsData();
  }
  
  ngAfterViewInit() {
    // Forzar redimensionamiento después de que la vista se ha inicializado
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visitsData'] && this.visitsData) {
      this.processVisitsData();
      // Forzar redimensionamiento cuando cambian los datos
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  }
  
  private processVisitsData() {
    if (!this.visitsData?.length) {
      this.processedVisitsData = [];
      return;
    }
    
    this.processedVisitsData = [{
      name: 'Visitas',
      series: this.visitsData.map(item => ({
        name: item.name,
        value: item.value
      }))
    }];
  }
  
  onSelect(event: any) {
    console.log(event);
  }
}