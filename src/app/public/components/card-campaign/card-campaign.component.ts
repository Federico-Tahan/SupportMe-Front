// fundraising-card.component.ts
import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Campaign } from '../../../core/shared/interfaces/campaign';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

// Interfaz para los iconos sociales/acciones
export interface SocialIcon {
  name: string;         // Nombre del icono (para identificación)
  iconClass: string;    // Clase CSS para el icono (ej: 'fa fa-facebook')
  url: string;          // URL a la que redirigir
  color?: string;       // Color opcional
  tooltip?: string;     // Texto de tooltip opcional
  isExternal?: boolean; // Si es true, abrirá en nueva pestaña
}

@Component({
  selector: 'app-card-campaign',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './card-campaign.component.html',
  styleUrl: './card-campaign.component.scss'
})
export class CardCampaignComponent implements AfterViewInit, OnChanges {
  @Input() campaign: Campaign;
  @Input() socialIcons: SocialIcon[] = [];
  @Input() isPrivateView: boolean = false;
  @ViewChild('tagsContainer') tagsContainer: ElementRef;
  
  canScrollLeft = false;
  canScrollRight = false;

  constructor() {
    
  }

  ngAfterViewInit() {
    this.checkScrollButtons();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['campaign'] && this.campaign) {
      this.initializeSocialIcons();
    }
    
    if (changes['campaign'] && this.campaign?.tags) {
      setTimeout(() => this.checkScrollButtons(), 0);
    }
  }
  
  private initializeSocialIcons() {
    this.socialIcons = [
      {
        name: 'publication',
        iconClass: 'fa fa-eye',
        url: '/projects/detail?id=' + this.campaign.id,
        color: '#ffffff',
        tooltip: 'Ver publicación',
        isExternal: false
      },
      {
        name: 'Editar',
        iconClass: 'fa fa-pencil',
        url: '/campaign/edit?id=' + this.campaign.id,
        color: '#ffffff',
        tooltip: 'Editar',
        isExternal: false
      }
    ];
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
    
    const maxScroll = element.scrollWidth - element.clientWidth;
    this.canScrollLeft = element.scrollLeft > 5;
    this.canScrollRight = maxScroll - element.scrollLeft > 5;
  }

  scrollTags(direction: 'left' | 'right', event: MouseEvent): void {
    event.stopPropagation();
    
    const container = this.tagsContainer.nativeElement;
    const scrollAmount = 100;
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
    
    this.checkScrollability();
  }
  
  // Make sure you have this method as well
  checkScrollability(): void {
    const container = this.tagsContainer.nativeElement;
    this.canScrollLeft = container.scrollLeft > 0;
    this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);
  }

  handleIconClick(icon: SocialIcon, event: MouseEvent): void {
    if (icon.isExternal) {
      window.open(icon.url, '_blank');
      event.preventDefault();
    }
  }

  get progressPercentage(): number {
    if (this.campaign.goalAmount) {
      return (this.campaign.raised / this.campaign.goalAmount) * 100;
    }
    return this.getTimeProgressPercentage();
  }

  getTimeProgressPercentage(): number {
    if (!this.campaign.goalDate) return 0;
    
    const now = new Date();
    const endDate = new Date(this.campaign.goalDate);
    const startDate = new Date(this.campaign.creationDate || now.setMonth(now.getMonth() - 1));
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = now.getTime() - startDate.getTime();
    
    return Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
  }

  get hasGoalAmount(): boolean {
    return !!this.campaign.goalAmount;
  }

  get hasEndDate(): boolean {
    return !!this.campaign.goalDate;
  }

  // Formatea la fecha para mostrar
  formatEndDate(): string {
    if (!this.campaign.goalDate) return '';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(this.campaign.goalDate).toLocaleDateString('es-ES', options);
  }
}