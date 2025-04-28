import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthContextService } from '../interceptor/auth-context';
import { CampaignStatistic } from '../interfaces/campaign-statistic';
import { Summary } from '../interfaces/summary';
import { GraphResponse } from '../interfaces/graph-response';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  http = inject(HttpClient);
  authContextService = inject(AuthContextService);

  constructor() { }

  getSummary(from: string, to: string): Observable<Summary> {
    this.authContextService.withAuth();
    return this.http.get<Summary>(environment.backApi + "dashboard/summary", {
      params: {
        from,
        to
      }
    });
  }

  getCampaignStatistic(from: string, to: string, campaignId :number): Observable<CampaignStatistic> {
    this.authContextService.withAuth();
    return this.http.get<CampaignStatistic>(environment.backApi + "dashboard/campaign", {
      params: {
        from,
        to,
        campaignId
      }
    });
  }

  getGraphIncome(from: string, to: string, campaignId :number): Observable<GraphResponse> {
    this.authContextService.withAuth();
    return this.http.get<GraphResponse>(environment.backApi + "dashboard/graph/income", {
      params: {
        from,
        to,
        campaignId
      }
    });
  }

  getGraphVisit(from: string, to: string, campaignId :number): Observable<GraphResponse> {
    this.authContextService.withAuth();
    return this.http.get<GraphResponse>(environment.backApi + "dashboard/graph/visit", {
      params: {
        from,
        to,
        campaignId
      }
    });
  }
}
