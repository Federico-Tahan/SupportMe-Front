import { SortingFilter } from "./sorting-filter";

export class BaseFilter {
    sorting : SortingFilter[];
    limit : number;
    skip : number;
    textFilter : string;
}
