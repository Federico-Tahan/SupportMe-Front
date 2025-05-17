import { SupportMessage } from "./support-message";

export interface Campaign {
    id : number;
    name : string;
    description : string;
    mainImage : string;
    creationDate : string;
    goalAmount : number;
    goalDate : string;
    category : string;
    location : string;
    tags : string[];
    raised: number;
    categoryId : number;
    isActive : boolean;
    assets : string[];
    donationsCount : number;
    supportMessages : SupportMessage[];
    views : number;
}