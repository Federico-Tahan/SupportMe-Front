// campaign-donation.component.ts
import { Component, ElementRef, Input, OnInit, ViewChild, inject, TemplateRef, Renderer2, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleCategory } from '../../../core/shared/interfaces/simple-category';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { SimpleDonation } from '../../../core/shared/interfaces/simple-donation';
import { BaseFilter } from '../../../core/shared/filters/base-filter';
import { SORTBY } from '../../../core/shared/filters/sorting-filter';

interface RecentDonation {
  name: string;
  amount: number;
  timeAgo: string;
}
interface DonationViewModel {
  name: string;
  amount: number;
  date: Date;
  formattedDate: string;
}

interface TopDonationViewModel extends DonationViewModel {
  rank: number;
}

@Component({
  selector: 'app-campaign-donation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './campaign-donation.component.html',
  styleUrl: './campaign-donation.component.scss'
})
export class CampaignDonationComponent implements OnInit {
  @Input() category: string = null;
  @Input() tags: string[] = null;
  @ViewChild('tagsContainer') tagsContainer: ElementRef;
  @ViewChild('allDonationsModal') allDonationsModalTpl: TemplateRef<any>;
  @ViewChild('topDonationsModal') topDonationsModalTpl: TemplateRef<any>;
  @Input() title: string = null;
  @Input() campaignId: number = null;
  @Input() amountRaised: number = null;
  @Input() views : number = null;
  campaignService = inject(CampaignService);
  renderer = inject(Renderer2);

  @Input() goalAmount: number = null;
  get percentageRaised(): number {
    if (!this.goalAmount || this.goalAmount === 0) return 0;
    return (this.amountRaised / this.goalAmount) * 100;
  }
  @Input() donationCount = 0;
  canScrollLeft = false;
  canScrollRight = false;
  @Input() recentDonations: RecentDonation[] = [];
  
  allDonations: DonationViewModel[] = [];
  topDonations: TopDonationViewModel[] = [];
  loadingModalData = false;
  modalTotalItems = 0;
  modalPageSize = 10;
  modalCurrentPage = 0;
  modalHasMoreItems = true;
  
  showAllDonationsModal = false;
  showTopDonationsModal = false;
  
  private recentDonationsFilter: BaseFilter = {
    limit: 4,
    sorting: [
      {
        sortBy: SORTBY.DESC,
        field: 'paymentDateUTC'
      }
    ],
    textFilter: null,
    skip: 0
  };
  
  private allDonationsFilter: BaseFilter = {
    sorting: [
      {
        sortBy: SORTBY.DESC,
        field: 'paymentDateUTC'
      }
    ],
    limit: null,
    textFilter: null,
    skip: 0
  };
  
  private topDonationsFilter: BaseFilter = {
    sorting: [
      {
        sortBy: SORTBY.DESC,
        field: 'amount'
      }
    ],
    textFilter: null,
    skip: 0,
    limit: null,
  };

  ngOnInit(): void {
    if (this.campaignId) {
      this.loadRecentDonations();
    }
    
    setTimeout(() => this.checkScrollButtons(), 100);
  }
  
  @HostListener('window:resize')
  onWindowResize() {
    this.checkScrollButtons();
  }
  
  loadRecentDonations(): void {
    this.campaignService.getDonationsByCampaigniD(this.campaignId, this.recentDonationsFilter)
      .subscribe({
        next: (response) => {
          this.recentDonations = response.items.map(donation => this.mapToRecentDonation(donation));
        },
        error: (error) => {
          console.error('Error loading donations:', error);
        }
      });
  }

  private mapToRecentDonation(donation: SimpleDonation): RecentDonation {
    return {
      name: donation.donatorName,
      amount: donation.amount,
      timeAgo: this.getTimeAgo(donation.date)
    };
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const donationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - donationDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `hace unos segundos`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
  }
  
  share(): void {
  }

  checkScrollButtons() {
    if (!this.tagsContainer) return;
    
    const element = this.tagsContainer.nativeElement;
    const hasOverflow = element.scrollWidth > element.clientWidth;
    
    if (!hasOverflow) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      return;
    }
    
    this.canScrollLeft = element.scrollLeft > 0;
    const maxScroll = element.scrollWidth - element.clientWidth;
    this.canScrollRight = element.scrollLeft < (maxScroll - 2);
  }

  scrollTags(direction: 'left' | 'right', event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    
    const element = this.tagsContainer.nativeElement;
    const scrollAmount = 100;
    
    if (direction === 'left') {
      element.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    
    setTimeout(() => this.checkScrollButtons(), 300);
  }

  openAllDonationsModal(): void {
    this.modalCurrentPage = 0;
    this.allDonations = [];
    this.modalHasMoreItems = true;
    this.showAllDonationsModal = true;
    this.loadAllDonations();
    
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    
    setTimeout(() => {
      const modalElement = document.querySelector('.custom-modal-body');
      if (modalElement) {
        modalElement.addEventListener('scroll', this.handleModalScroll.bind(this, 'all'));
      }
    }, 100);
  }
  
  openTopDonationsModal(): void {
    this.modalCurrentPage = 0;
    this.topDonations = [];
    this.modalHasMoreItems = true;
    this.showTopDonationsModal = true;
    this.loadTopDonations();
    
    // Prevenir scroll en el body cuando se abre el modal
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    
    // Necesitamos esperar a que Angular renderice el modal antes de agregar el evento
    setTimeout(() => {
      const modalElement = document.querySelector('.custom-modal-body');
      if (modalElement) {
        modalElement.addEventListener('scroll', this.handleModalScroll.bind(this, 'top'));
      }
    }, 100);
  }
  
  // Cerrar modales
  closeModal(): void {
    this.showAllDonationsModal = false;
    this.showTopDonationsModal = false;
    
    // Restaurar scroll en el body cuando se cierra el modal
    this.renderer.removeStyle(document.body, 'overflow');
  }
  
  // Manejar el evento de scroll en los modales
  handleModalScroll(modalType: 'all' | 'top', event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 200;
    
    if (atBottom && this.modalHasMoreItems && !this.loadingModalData) {
      if (modalType === 'all') {
        this.loadAllDonations(true);
      } else {
        this.loadTopDonations(true);
      }
    }
  }
  
  // Cargar todas las donaciones (para el modal "Ver todas")
  loadAllDonations(loadMore = false): void {
    if (this.loadingModalData || (!loadMore && this.allDonations.length > 0)) return;
    
    this.loadingModalData = true;
    
    // Si estamos cargando más, aumentamos el skip
    if (loadMore) {
      this.modalCurrentPage++;
    }
    
    const paginatedFilter: BaseFilter = {
      ...this.allDonationsFilter,
      limit: this.modalPageSize,
      skip: this.modalCurrentPage * this.modalPageSize
    };
    
    this.campaignService.getDonationsByCampaigniD(this.campaignId, paginatedFilter)
      .subscribe({
        next: (response) => {
          const newDonations = response.items.map(item => this.mapToDonationViewModel(item));
          
          if (loadMore) {
            this.allDonations = [...this.allDonations, ...newDonations];
          } else {
            this.allDonations = newDonations;
            this.modalTotalItems = response.totalRegisters || 0;
          }
          
          this.modalHasMoreItems = newDonations.length === this.modalPageSize;
          this.loadingModalData = false;
        },
        error: (error) => {
          console.error('Error loading donations:', error);
          this.loadingModalData = false;
        }
      });
  }
  
  // Cargar top donaciones (para el modal "Ver top donaciones")
  loadTopDonations(loadMore = false): void {
    if (this.loadingModalData || (!loadMore && this.topDonations.length > 0)) return;
    
    this.loadingModalData = true;
    
    // Si estamos cargando más, aumentamos el skip
    if (loadMore) {
      this.modalCurrentPage++;
    }
    
    const paginatedFilter: BaseFilter = {
      ...this.topDonationsFilter,
      limit: this.modalPageSize,
      skip: this.modalCurrentPage * this.modalPageSize
    };
    
    this.campaignService.getDonationsByCampaigniD(this.campaignId, paginatedFilter)
      .subscribe({
        next: (response) => {
          const startRank = this.modalCurrentPage * this.modalPageSize + 1;
          const newDonations = response.items.map((item, index) => 
            this.mapToTopDonationViewModel(item, startRank + index)
          );
          
          if (loadMore) {
            this.topDonations = [...this.topDonations, ...newDonations];
          } else {
            this.topDonations = newDonations;
            this.modalTotalItems = response.totalRegisters || 0;
          }
          
          this.modalHasMoreItems = newDonations.length === this.modalPageSize;
          this.loadingModalData = false;
        },
        error: (error) => {
          console.error('Error loading top donations:', error);
          this.loadingModalData = false;
        }
      });
  }
  
  // Mapeo de objetos SimpleDonation a objetos viewModel
  private mapToDonationViewModel(donation: SimpleDonation): DonationViewModel {
    const date = new Date(donation.date);
    return {
      name: donation.donatorName,
      amount: donation.amount,
      date: date,
      formattedDate: this.formatDate(date)
    };
  }
  
  private mapToTopDonationViewModel(donation: SimpleDonation, rank: number): TopDonationViewModel {
    const date = new Date(donation.date);
    return {
      name: donation.donatorName,
      amount: donation.amount,
      date: date,
      formattedDate: this.formatDate(date),
      rank: rank
    };
  }
  
  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}