import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { PaymentService } from '../../../core/shared/services/payment.service';
import { SimpleDonations } from '../../../core/shared/interfaces/simple-donations';
import { UserService } from '../../../core/shared/services/user.service';
import { UserProfile } from '../../../core/shared/interfaces/user-profile';
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { Campaign } from '../../../core/shared/interfaces/campaign';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private userService = inject(UserService);
  private campaignService = inject(CampaignService);

  userProfile: UserProfile | null = null;
  hasProfileImage: boolean = false;
  showAllDonations: boolean = false;
  isLoadingProfile: boolean = false;
  
  get profileName(): string {
    if (this.userProfile) {
      return `${this.userProfile.name} ${this.userProfile.lastName}`;
    }
    return '';
  }
  
  get profileEmail(): string {
    return this.userProfile?.email || '';
  }
  
  get userInitials(): string {
    if (this.userProfile) {
      const firstInitial = this.userProfile.name.charAt(0);
      return (firstInitial).toUpperCase();
    }
    return '';
  }
  
  get stats() {
    return [
      { number: this.userProfile?.donationsCount.toString() || '0', label: 'Donaciones realizadas' },
      { number: `$${this.formatLargeAmount(this.userProfile?.totalDonated || 0)}`, label: 'Total donado (ARS)' },
      { 
        number: this.userProfile ? 
          new Date(this.userProfile.createdDate).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }) : 
          '-', 
        label: 'Miembro desde' 
      },
    ];
  }
  
  donationsList: SimpleDonations[] = [];
  
  currentPage: number = 0;
  pageSize: number = 5;
  hasMoreDonations: boolean = true;
  isLoadingDonations: boolean = false;

  get visibleDonations(): SimpleDonations[] {
    return this.donationsList;
  }

  topCampaigns: Campaign[] = [];
  isLoadingCampaigns: boolean = false;
  
  get hasCampaigns(): boolean {
    return this.topCampaigns.length > 0;
  }

  ngOnInit(): void {
    this.loadUserProfile();
    
    this.loadDonations();
    
    this.loadTopCampaigns();
    
    this.animateStatNumbers();
  }

  loadUserProfile(): void {
    this.isLoadingProfile = true;
    
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.hasProfileImage = !!profile.profilePc;
        this.isLoadingProfile = false;
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.isLoadingProfile = false;
      }
    });
  }
  
  loadTopCampaigns(): void {
    this.isLoadingCampaigns = true;
    
    this.campaignService.getMostRaisedCampaigns().subscribe({
      next: (campaigns) => {
        const sortedCampaigns = campaigns.sort((a, b) => b.raised - a.raised);
        
        this.topCampaigns = sortedCampaigns.slice(0, 5);
        this.isLoadingCampaigns = false;
      },
      error: (error) => {
        console.error('Error al cargar las campañas:', error);
        this.isLoadingCampaigns = false;
      }
    });
  }
  loadDonations(): void {
    if (!this.hasMoreDonations || this.isLoadingDonations) return;
    
    this.isLoadingDonations = true;
    
    this.paymentService.getDonationsPayments(this.currentPage * this.pageSize, this.pageSize)
      .subscribe({
        next: (donations) => {
          if (donations.length < this.pageSize) {
            this.hasMoreDonations = false;
          }
          
          this.donationsList = [...this.donationsList, ...donations];
          this.isLoadingDonations = false;
        },
        error: (error) => {
          console.error('Error al cargar donaciones:', error);
          this.isLoadingDonations = false;
        }
      });
  }

  loadMoreDonations(): void {
    this.currentPage++;
    this.loadDonations();
  }

  animateStatNumbers(): void {
  }
  
  calculateProgress(raised: number, goal: number): number {
    const percentage = (raised / goal) * 100;
    return Math.min(percentage, 100);
  }
  
  editProfile(): void {
  }
  
  formatLargeAmount(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  }
}