import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header-form.component.html',
  styleUrl: './header-form.component.scss'
})
export class HeaderFormComponent {
  @Input() title: string = 'Mis campañas';
  @Input() startDate: Date = new Date();
  @Input() endDate: Date = new Date();
  @Input() showDateRange: boolean = true;
  @Input() searchPlaceholder: string = 'Buscar';
  @Input() filterOptions: { label: string, value: string }[] = [];
  
  @Output() search = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<{ start: Date, end: Date }>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() export = new EventEmitter<void>();
  
  searchText: string = '';
  selectedFilter: string = '';
    
  onSearch(): void {
    this.search.emit(this.searchText);
  }
  
  onFilterSelect(filter: string): void {
    this.selectedFilter = filter;
    this.filterChange.emit(filter);
  }
  
  
  onExport(): void {
    this.export.emit();
  }

}
