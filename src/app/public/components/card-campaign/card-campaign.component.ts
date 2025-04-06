import { Component, Input } from '@angular/core';
import { Campaign } from '../../../core/shared/interfaces/campaign';

@Component({
  selector: 'app-card-campaign',
  standalone: true,
  imports: [],
  templateUrl: './card-campaign.component.html',
  styleUrl: './card-campaign.component.scss'
})
export class CardCampaignComponent {
  @Input() campaign : Campaign;

  get progressPercentage(): number {
    return (this.campaign.amountRaised / this.campaign.goalAmount) * 100;
  }
}
