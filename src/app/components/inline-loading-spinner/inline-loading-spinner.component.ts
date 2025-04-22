import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inline-loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './inline-loading-spinner.component.html',
  styleUrl: './inline-loading-spinner.component.scss'
})
export class InlineLoadingSpinnerComponent {
  @Input() isLoading = false;
}
