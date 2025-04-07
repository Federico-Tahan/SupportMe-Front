import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss'
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: 'warning' | 'info' | 'success' | 'error' = 'info';
  @Input() icon: string = '';

  cardTypeClass: string = '';
  iconClass: string = '';

  ngOnInit(): void {
    this.cardTypeClass = this.type;
    
    if (!this.icon) {
      this.icon = this.getDefaultIcon();
    }
    
    this.iconClass = `fas fa-${this.icon}`;
  }

  private getDefaultIcon(): string {
    switch (this.type) {
      case 'warning':
        return 'exclamation';
      case 'info':
        return 'info-circle';
      case 'success':
        return 'check-circle';
      case 'error':
        return 'times-circle';
      default:
        return 'info-circle';
    }
  }
}
