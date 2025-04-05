import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CardSettingsComponent } from "../../../intranet/components/card-settings/card-settings.component";
import { CardCampaignComponent } from "../card-campaign/card-campaign.component";
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { Campaign } from '../../../core/shared/interfaces/campaign';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, CardSettingsComponent, CardCampaignComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit{
  campaignService = inject(CampaignService);

  campaigns : Campaign[];

  ngOnInit(): void {
    this.campaignService.getCampaigns().subscribe({
      next : (data) => {
        this.campaigns = data.items;
      }
    })
    
  }

}
