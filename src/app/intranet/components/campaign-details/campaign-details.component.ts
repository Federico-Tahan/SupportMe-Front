import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Campaign {
  name: string;
  raised: string;
  goal: string;
  donors: string;
  daysLeft: string;
  percentage: string;
  donations: number[];
  visits: number[];
}

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent {
  @Input() campaigns: Campaign[] = [];
  @Input() selectedCampaign!: Campaign;
  @Output() campaignChanged = new EventEmitter<Campaign>();

  selectedCampaignName = '';

  ngOnChanges() {
    if (this.selectedCampaign) {
      this.selectedCampaignName = this.selectedCampaign.name;
    }
  }

  onCampaignSelect() {
    const selected = this.campaigns.find(c => c.name === this.selectedCampaignName);
    if (selected) {
      this.campaignChanged.emit(selected);
    }
  }
}