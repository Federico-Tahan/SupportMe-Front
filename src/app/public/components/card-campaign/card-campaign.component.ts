import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-campaign',
  standalone: true,
  imports: [],
  templateUrl: './card-campaign.component.html',
  styleUrl: './card-campaign.component.scss'
})
export class CardCampaignComponent {
  @Input() imageUrl: string = 'https://images.gofundme.com/yRXw9DofCq8pcyBwVH57E6QRqUc=/720x405/https://d2g8igdw686xgo.cloudfront.net/89844979_1743182735176991_r.png';
  @Input() category: string = 'Educacion';
  @Input() location: string = 'Argentina';
  @Input() title: string = 'Ayuda a la gente en africa';
  @Input() description: string = 'adsasdasdasd';
  @Input() amountRaised: number = 500;
  @Input() goalAmount: number = 1000;

  get progressPercentage(): number {
    return (this.amountRaised / this.goalAmount) * 100;
  }
}
