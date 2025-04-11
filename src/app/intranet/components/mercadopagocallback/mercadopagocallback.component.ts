import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentServiceService } from '../../../core/shared/services/payment-service.service';

@Component({
  selector: 'app-mercadopagocallback',
  standalone: true,
  imports: [],
  templateUrl: './mercadopagocallback.component.html',
  styleUrl: './mercadopagocallback.component.scss'
})
export class MercadopagocallbackComponent implements OnInit {
  code: string = '';
   service = inject(PaymentServiceService);
   router = inject(ActivatedRoute);
   route = inject(Router);
   ngOnInit(): void {
     this.router.queryParams.subscribe(params => {
       this.code = params['code'];
       this.service.vinculateMP(this.code).subscribe({
         next : (data) => {
           if(data.success){
              this.route.navigate(['/setup/mercadopago'])
           }
         }
       })
     });
   }
}
