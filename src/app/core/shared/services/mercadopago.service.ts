import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { MpCard } from '../interfaces/mp-card';
declare var MercadoPago: any;
export interface IdentificationType {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {
  mp: any;

  loadMercadoPagoSDK(publickey : string) {
    if (typeof window !== 'undefined' && (window as any).MercadoPago) {
      this.mp = new (window as any).MercadoPago(publickey);
    } else {
      console.error("MercadoPago SDK no está disponible, verifica que el script se haya cargado correctamente.");
    }
  }

  generatePaymentMethod(bin : string) : Promise<string> {
    console.log(bin);
    return this.mp.getPaymentMethods({bin})
      .then((response: any) => {
        return response.results[0].id;
      })
      .catch((error: any) => {
      });
  }

  async getIdentificationTypes(): Promise<IdentificationType[]> {
    try {
      return await this.mp.getIdentificationTypes();
    } catch (error) {
      return [];
    }
  }
  

  generateCardToken(form : MpCard) : any {
    console.log(form);
    return this.mp.createCardToken(form)
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
      });
  }
}
