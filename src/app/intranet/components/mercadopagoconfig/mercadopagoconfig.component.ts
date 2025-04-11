import { Component, OnInit, inject } from '@angular/core';
import { SetupService } from '../../../core/shared/services/setup.service';

@Component({
  selector: 'app-mercadopagoconfig',
  standalone: true,
  imports: [],
  templateUrl: './mercadopagoconfig.component.html',
  styleUrl: './mercadopagoconfig.component.scss'
})
export class MercadopagoconfigComponent implements OnInit{
  isMpConfigured = undefined;
  setupService = inject(SetupService);

  ngOnInit(): void {
    this.setupService.getSetup().subscribe({
      next: (data) => {
        this.isMpConfigured = data.hasMercadoPagoConfigured;
      }
    })
  }
}
