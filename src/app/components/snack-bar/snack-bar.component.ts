import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

export type SnackBarType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
  animations: [
    trigger('snackBarState', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => visible', animate('225ms cubic-bezier(0, 0, 0.2, 1)')),
      transition('visible => void', animate('195ms cubic-bezier(0.4, 0, 1, 1)'))
    ])
  ]
})
export class SnackBarComponent {
  @Input() message: string = '';
  @Input() type: SnackBarType = 'info';
  @Input() duration: number = 5000; // 5 segundos por defecto
  @Output() closed = new EventEmitter<void>();
  
  visible: boolean = true;
  timeoutId: any;

  ngOnInit() {
    if (this.duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  dismiss() {
    this.visible = false;
    setTimeout(() => {
      this.closed.emit();
    }, 200); // tiempo para que termine la animación
  }

  getIconName(): string {
    switch (this.type) {
      case 'success': return 'fa-solid fa-circle-check';
      case 'error': return 'fa-solid fa-circle-xmark';
      case 'warning': return 'fa-solid fa-triangle-exclamation';
      case 'info': 
      default: return 'fa-solid fa-circle-info';
    }
  }
}