import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-settings.component.html',
  styleUrl: './card-settings.component.scss'
})
export class CardSettingsComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() iconColor: 'purple' | 'blue' = 'blue';
}
