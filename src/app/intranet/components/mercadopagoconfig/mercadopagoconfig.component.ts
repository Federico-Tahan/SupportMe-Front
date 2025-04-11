import { Component, OnInit, inject } from '@angular/core';
import { SetupService } from '../../../core/shared/services/setup.service';
import { PaymentServiceService } from '../../../core/shared/services/payment-service.service';

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
  paymentService = inject(PaymentServiceService);

  ngOnInit(): void {
    this.setupService.getSetup().subscribe({
      next: (data) => {
        this.isMpConfigured = data.hasMercadoPagoConfigured;
      }
    })
  }


  deleteToken(){
    this.paymentService.DeleteTokenMP().subscribe({
      next: (data) => {
        if(data.success){
          this.setupService.getSetup().subscribe({
            next: (data) => {
              this.isMpConfigured = data.hasMercadoPagoConfigured;
            }
          })
        }
      }
    })
  }
}
