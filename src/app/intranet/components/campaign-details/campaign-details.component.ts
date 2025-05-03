import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleCampaign } from '../../../core/shared/interfaces/simple-campaign';
import { DashboardService } from '../../../core/shared/services/dashboard.service';
import { CampaignStatistic } from '../../../core/shared/interfaces/campaign-statistic';
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { InlineLoadingSpinnerComponent } from '../../../components/inline-loading-spinner/inline-loading-spinner.component';
import { ChartsComponent } from "../charts/charts.component";

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [CommonModule, FormsModule, InlineLoadingSpinnerComponent, ChartsComponent],
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit, OnChanges {
  campaigns: SimpleCampaign[] = [];
  @Input() from: string = null;
  @Input() to: string = null;
  
  dashboardService = inject(DashboardService);
  campaignService = inject(CampaignService);
  cdr = inject(ChangeDetectorRef);
  
  campaignStatistic: CampaignStatistic = undefined;
  selectedCampaign: SimpleCampaign;
  loading = false;
  isDropdownOpen = false;
  
  @Output() campaignChanged = new EventEmitter<SimpleCampaign>();
  
  ngOnInit(): void {
    this.loadCampaigns();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['from'] || changes['to']) && this.selectedCampaign && this.from && this.to) {
      this.loadCampaignStatistics();
    }
  }
  
  loadCampaigns(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.campaignService.getCampaignSimple().subscribe({
      next: (data) => {
        this.campaigns = data;
        if (this.campaigns && this.campaigns.length > 0) {
          this.selectedCampaign = this.campaigns[0];
          if (this.from && this.to) {
            this.loadCampaignStatistics();
          } else {
            this.loading = false;
            this.cdr.detectChanges();
          }
          // Emit the initially selected campaign
          this.campaignChanged.emit(this.selectedCampaign);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading campaigns:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  loadCampaignStatistics(): void {
    if (!this.selectedCampaign || !this.from || !this.to) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    
    this.loading = true;
    this.cdr.detectChanges();
    
    
    this.dashboardService.getCampaignStatistic(this.from, this.to, this.selectedCampaign.id)
      .subscribe({
        next: (data) => {
          this.campaignStatistic = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading campaign statistics:', err);
          this.campaignStatistic = undefined;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  selectCampaign(campaign: SimpleCampaign): void {
    this.selectedCampaign = campaign;
    this.isDropdownOpen = false;
    this.loadCampaignStatistics();
    this.campaignChanged.emit(campaign);
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.custom-dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}