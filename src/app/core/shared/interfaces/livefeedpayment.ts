import { Pagination } from "./pagination";
import { PaymentDetailRead } from "./payment-detail-read";

export interface Livefeedpayment {
    items : Pagination<PaymentDetailRead>;
    totalRegisters : number;
    totalOk : number;
    totalError: number;
    totalRefunded : number;
}
