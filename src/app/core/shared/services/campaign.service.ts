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


  getCampaignById(id : number): Observable<Campaign> {

    return this.http.get<Campaign>(
      environment.backApi + "campaign/" + id
    );
  }



  getDonationsByCampaigniD(id: number, filter?: BaseFilter): Observable<Pagination<SimpleDonation>> {
    // Determinar el endpoint según el campo de ordenamiento
    let endpoint = 'donations/recents'; // Por defecto usamos /recents
    
    if (filter && filter.sorting && filter.sorting.length > 0) {
      // Si el campo de ordenamiento es "amount", usamos el endpoint top
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
        // No incluimos el campo field en la URL ya que está implícito en el endpoint
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
