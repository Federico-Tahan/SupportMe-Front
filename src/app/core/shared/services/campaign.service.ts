import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../interfaces/pagination';
import { Campaign } from '../interfaces/campaign';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { ProjectFilter } from '../filters/project-filter';
import { AuthContextService } from '../interceptor/auth-context';
import { CampaignWrite } from '../interfaces/campaign-write';
import { SimpleDonation } from '../interfaces/simple-donation';
import { BaseFilter } from '../filters/base-filter';
import { SimpleCampaign } from '../interfaces/simple-campaign';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  http = inject(HttpClient);
  authContextService = inject(AuthContextService);
  constructor() { }


  createCampaign(campaign: CampaignWrite) : Observable<any>{
    return this.http.post<any>(environment.backApi + "campaign", campaign);
  }


  updateCampaign(campaign: CampaignWrite) : Observable<any>{
    return this.http.put<any>(environment.backApi + "campaign", campaign);
  }
  getCampaignSimple(): Observable<SimpleCampaign[]> {
    this.authContextService.withAuth();
    return this.http.get<SimpleCampaign[]>(
      environment.backApi + "campaign/simple"
    );
  }


  getCampaignById(id : number): Observable<Campaign> {

    return this.http.get<Campaign>(
      environment.backApi + "campaign/" + id
    );
  }
  
  view(id : number): Observable<any> {

    return this.http.get<any>(
      environment.backApi + "campaign/" + id + "/view"
    );
  }

  getMostRaisedCampaigns(): Observable<Campaign[]> {
    this.authContextService.withAuth();
    return this.http.get<Campaign[]>(environment.backApi + "campaign/most/raised");
  }

  getDonationsByCampaigniD(id: number, filter?: BaseFilter): Observable<Pagination<SimpleDonation>> {
    let endpoint = 'donations/recents';
    
    if (filter && filter.sorting && filter.sorting.length > 0) {
      if (filter.sorting[0].field === 'amount') {
        endpoint = 'donations/top';
      }
    }
    
    let url = `${environment.backApi}campaign/${id}/${endpoint}`;
    
    if (filter) {
      const queryParams = [];
      
      if (filter.limit !== undefined) {
        queryParams.push(`limit=${filter.limit}`);
      }
      
      if (filter.skip !== undefined) {
        queryParams.push(`skip=${filter.skip}`);
      }
      
      if (filter.sorting && filter.sorting.length > 0) {
        const sorting = filter.sorting[0];
        queryParams.push(`sortBy=${sorting.sortBy}`);
      }
      
      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }
    }
    
    return this.http.get<Pagination<SimpleDonation>>(url);
  }

  getCampaigns(filter?: ProjectFilter, isPublic : boolean = true): Observable<Pagination<Campaign>> {
    if (isPublic) {
      this.authContextService.withoutAuth();
    } else {
      this.authContextService.withAuth();
    }
    let params = new HttpParams();
    
    if (filter) {
      if (filter.categoryId) {
        params = params.set('categoryId', filter.categoryId.toString());
      }
      
      if (filter.limit) {
        params = params.set('limit', filter.limit.toString());
      }
      
      if (filter.skip !== undefined && filter.skip !== null) {
        params = params.set('skip', filter.skip.toString());
      }
      
      if (filter.textFilter) {
        params = params.set('textFilter', filter.textFilter.toString());
      }
    }
    
    return this.http.get<Pagination<Campaign>>(
      environment.backApi + "campaign", 
      { params }
    );
  }
}
