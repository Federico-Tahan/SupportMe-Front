export interface PaymentDetail {
    amount : number;
    status : string;
    donatorName : string;
    campaignName : string;
    last4 : string;
    brand : string;
    date : Date;
    comment : string;
    commissionSupportMe : number;
    commissionMP : number;
    netReceived : number;
}
