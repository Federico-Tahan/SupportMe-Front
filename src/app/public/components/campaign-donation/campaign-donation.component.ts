// campaign-donation.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RecentDonation {
  name: string;
  amount: number;
  timeAgo: string;
}

@Component({
  selector: 'app-campaign-donation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-donation.component.html',
  styleUrl: './campaign-donation.component.scss'
})
export class CampaignDonationComponent {
  title = 'Empower a Girl: For Self-Reliance';
  amountRaised = 82567;
  goalAmount = 100000;
  progressPercentage = (this.amountRaised / this.goalAmount) * 100;
  donationCount = '1.1K';
  
  recentDonations: RecentDonation[] = [
    { name: 'William Davis', amount: 20, timeAgo: '4d' },
    { name: 'Paula Martinez', amount: 10, timeAgo: '4d' },
    { name: 'John Smith', amount: 50, timeAgo: '4d' },
    { name: 'Elizabeth Watson', amount: 100, timeAgo: '4d' }
  ];
  
  donate(): void {
    alert('Redirigiendo a la página de pago...');
  }
  
  share(): void {
    alert('Compartiendo campaña...');
  }
}