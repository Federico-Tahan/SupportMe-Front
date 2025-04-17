import { Assets } from "./assets";
import { Tags } from "./tags";

export interface CampaignWrite {
    name: string;
    mainImage: string;
    description : string;
    goalAmount : number;
    goalDate : Date;
    assets : Assets[];
    tags : Tags[];
    id: number;
    categoryId: number;
}
