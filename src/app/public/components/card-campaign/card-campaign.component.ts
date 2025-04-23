// Modificaciones mínimas al archivo fundraising-card.component.ts

import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { Campaign } from '../../../core/shared/interfaces/campaign';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

// Interfaz para los iconos sociales/acciones (sin cambios)
export interface SocialIcon {
  name: string;
  iconClass: string;
  url: string;
  color?: string;
  tooltip?: string;
  isExternal?: boolean;
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

  constructor() {}

  ngAfterViewInit() {
    // Verificar el estado de los botones después de que la vista se haya inicializado
    setTimeout(() => this.updateScrollButtons(), 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['campaign'] && this.campaign) {
      this.initializeSocialIcons();
    }
    
    if (changes['campaign'] && this.campaign?.tags) {
      // Verificar los botones de scroll cuando cambian los tags
      setTimeout(() => this.updateScrollButtons(), 100);
    }
  }
  
  // Detectar cambios de tamaño de ventana
  @HostListener('window:resize')
  onWindowResize() {
    this.updateScrollButtons();
  }
  
  private initializeSocialIcons() {
    // Mantener la lógica original
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

  // Método unificado para actualizar botones
  updateScrollButtons() {
    if (!this.tagsContainer) return;
    
    const element = this.tagsContainer.nativeElement;
    const hasOverflow = element.scrollWidth > element.clientWidth;
    
    if (!hasOverflow) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      return;
    }
    
    // Comprobar si podemos desplazarnos a la izquierda
    this.canScrollLeft = element.scrollLeft > 2;
    
    // Comprobar si podemos desplazarnos a la derecha
    const maxScroll = element.scrollWidth - element.clientWidth;
    this.canScrollRight = maxScroll - element.scrollLeft > 2;
  }

  scrollTags(direction: 'left' | 'right', event: MouseEvent): void {
    event.stopPropagation();
    
    const container = this.tagsContainer.nativeElement;
    // Usar un valor fijo pero razonable para el scroll
    const scrollAmount = 100;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    
    // Actualizar la visibilidad de los botones después de que termine la animación
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  // Método para cuando el usuario hace scroll manualmente
  onTagsScroll() {
    this.updateScrollButtons();
  }

  // Mantener el resto del componente sin cambios
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

  formatEndDate(): string {
    if (!this.campaign.goalDate) return '';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(this.campaign.goalDate).toLocaleDateString('es-ES', options);
  }
}