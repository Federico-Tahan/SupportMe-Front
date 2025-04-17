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
    assets : string[];
    donationsCount : number;
}