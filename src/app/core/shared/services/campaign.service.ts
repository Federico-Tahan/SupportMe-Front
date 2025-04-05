import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../interfaces/pagination';
import { Campaign } from '../interfaces/campaign';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  http = inject(HttpClient);
  constructor() { }

    getCampaigns() : Observable<Pagination<Campaign>>{
      return this.http.get<Pagination<Campaign>>(environment.backApi + "campaign");
    }
}
