import { Card } from "./card";

export interface PaymentInformation {
    card: Card;
    installments: number;
    currency: string;
    amount: number;
    deviceId: string;
}
