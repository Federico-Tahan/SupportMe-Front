import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-snipper',
  standalone: true,
  imports: [],
  templateUrl: './loading-snipper.component.html',
  styleUrl: './loading-snipper.component.scss'
})
export class LoadingSnipperComponent {
  @Input() isLoading = false;

}
