import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../interfaces/pagination';
import { Campaign } from '../interfaces/campaign';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { ProjectFilter } from '../filters/project-filter';
import { AuthContextService } from '../interceptor/auth-context';
import { CampaignWrite } from '../interfaces/campaign-write';

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
