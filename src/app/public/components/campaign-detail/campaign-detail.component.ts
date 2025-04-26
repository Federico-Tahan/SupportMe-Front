// campaign-detail.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignDonationComponent } from "../campaign-donation/campaign-donation.component";
import { Campaign } from '../../../core/shared/interfaces/campaign';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { LoadingSnipperComponent } from "../../../components/loading-snipper/loading-snipper.component";
import { SupportMessage } from '../../../core/shared/interfaces/support-message';
import { DateParserPipe } from '../../../core/shared/pipes/date-parser.pipe';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule, CampaignDonationComponent, RouterLink, LoadingSnipperComponent, DateParserPipe],
  templateUrl: './campaign-detail.component.html',
  styleUrl: './campaign-detail.component.scss'
})
export class CampaignDetailComponent implements AfterViewInit, OnInit {

  @ViewChild('thumbnailsContainer') thumbnailsContainer!: ElementRef;
  campaign : Campaign = undefined;
  title : string = null;
  description  : string = null;
  mainImage : string = null;
  thumbnails : string[];
  supportMessages: SupportMessage[] = [];
  canScrollLeft = false;
  canScrollRight = true;
  router = inject(ActivatedRoute);
  campaignId : number = undefined;
  campaignService = inject(CampaignService);
  isLoading = false;

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.campaignId = params['id'];
      this.isLoading = true;

      this.campaignService.getCampaignById(this.campaignId).subscribe({
        next : (data) => {
            this.campaign = data;
            this.campaign.assets.unshift(this.campaign.mainImage);
            this.mainImage = data.mainImage;
            this.supportMessages = data.supportMessages;
            this.isLoading = false;

        },
        error: (error) => {
          this.isLoading = false;
        }
      })

      this.campaignService.view(this.campaignId).subscribe({
        next : (data) => {
        },
        error: (error) => {
        }
      })
    });  
  }
  changeThumbnail(index: number): void {
    this.mainImage = this.campaign.assets[index];
  }
    
  share(): void {
    console.log('Compartiendo campaña...');
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkScrollButtons();
      
      window.addEventListener('resize', () => {
        this.checkScrollButtons();
      });
    }, 100);
  }
  
  scrollThumbnails(direction: 'left' | 'right'): void {
    if (!this.thumbnailsContainer) return;
    
    const element = this.thumbnailsContainer.nativeElement;
    const scrollAmount = element.clientWidth / 2;
    
    if (direction === 'left') {
      element.scrollLeft -= scrollAmount;
    } else {
      element.scrollLeft += scrollAmount;
    }
        setTimeout(() => {
      this.checkScrollButtons();
    }, 300);
  }
  
  checkScrollButtons(): void {
    if (!this.thumbnailsContainer) return;
    const element = this.thumbnailsContainer.nativeElement;
    this.canScrollLeft = element.scrollLeft > 0;
    const hasMoreToScroll = element.scrollWidth > element.clientWidth + element.scrollLeft;
    this.canScrollRight = hasMoreToScroll; 
  }
}