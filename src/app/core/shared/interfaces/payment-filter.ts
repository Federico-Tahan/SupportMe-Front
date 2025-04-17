export interface PaymentFilter {
    brand : string[];
    campaignId : number[];
    status : string[];
    from : Date;
    to : Date;
    Limit : number;
    skip: number;
    textFilter : string;
}
