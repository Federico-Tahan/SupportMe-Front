import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
   
   ngOnInit(): void {
     this.router.queryParams.subscribe(params => {
       this.code = params['code'];
       this.service.vinculateMP(this.code).subscribe({
         next : (data) => {
           if(data.success){
              alert("MOBOOOOOOENOOO");
           }
         }
       })
     });
   }
}
