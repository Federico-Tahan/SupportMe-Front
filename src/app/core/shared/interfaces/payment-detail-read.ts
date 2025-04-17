import { SimpleCampaign } from "./simple-campaign";

export interface PaymentDetailRead {
    amount : number;
    status : string;
    last4: string;
    brand: string;
    campaign : SimpleCampaign;
    paymentDate: Date;
    customerName : string;
}
