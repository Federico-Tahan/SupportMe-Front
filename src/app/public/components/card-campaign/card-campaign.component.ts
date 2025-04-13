// fundraising-card.component.ts
import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Campaign } from '../../../core/shared/interfaces/campaign';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './card-campaign.component.html',
  styleUrl: './card-campaign.component.scss'
})
export class CardCampaignComponent implements AfterViewInit, OnChanges {
  @Input() campaign: Campaign;
  @Input() socialIcons: SocialIcon[] = [];  // Arreglo de iconos sociales
  @Input() isPrivateView: boolean = false;  // Bandera para determinar si es vista privada
  @ViewChild('tagsContainer') tagsContainer: ElementRef;
  
  canScrollLeft = false;
  canScrollRight = false;

  constructor() {
    // Iconos sociales predeterminados (se pueden sobrescribir)
    this.socialIcons = [
      {
        name: 'publication',
        iconClass: 'fa fa-eye',
        url: '#donate',
        color: '#ffffff',
        tooltip: 'Ver publicación',
        isExternal: false
      },
      {
        name: 'Editar',
        iconClass: 'fa fa-pencil',
        url: '#details',
        color: '#ffffff',
        tooltip: 'Editar',
        isExternal: false
      }
    ];
  }

  ngAfterViewInit() {
    this.checkScrollButtons();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Si cambian los tags, debemos verificar los botones después de que se renderice la vista
    if (changes['campaign'] && this.campaign?.tags) {
      setTimeout(() => this.checkScrollButtons(), 0);
    }
  }

  // Comprobar si se deben mostrar los botones de desplazamiento
  checkScrollButtons() {
    if (!this.tagsContainer) return;
    
    const element = this.tagsContainer.nativeElement;
    
    // Solo mostrar los botones si hay overflow
    const hasOverflow = element.scrollWidth > element.clientWidth;
    
    if (!hasOverflow) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      return;
    }
    
    // Determinar si los botones deben mostrarse con mayor precisión
    const maxScroll = element.scrollWidth - element.clientWidth;
    
    // Botón izquierdo: visible si hemos desplazado al menos 5px
    this.canScrollLeft = element.scrollLeft > 5;
    
    // Botón derecho: visible si quedan al menos 5px por desplazar
    this.canScrollRight = maxScroll - element.scrollLeft > 5;
  }

  // Desplazar los tags
  scrollTags(direction: 'left' | 'right') {
    if (!this.tagsContainer) return;
    
    const element = this.tagsContainer.nativeElement;
    const scrollAmount = 100; // Cantidad a desplazar en píxeles
    
    if (direction === 'left') {
      element.scrollLeft -= scrollAmount;
    } else {
      element.scrollLeft += scrollAmount;
    }
    
    // Actualizar la visibilidad de los botones después del desplazamiento
    setTimeout(() => this.checkScrollButtons(), 300); // Aumentar tiempo para asegurar que el scroll se complete
  }

  // Manejar clic en icono social
  handleIconClick(icon: SocialIcon, event: MouseEvent): void {
    if (icon.isExternal) {
      window.open(icon.url, '_blank');
      event.preventDefault();
    }
  }

  get progressPercentage(): number {
    if (this.campaign.goalAmount) {
      return (this.campaign.amountRaised / this.campaign.goalAmount) * 100;
    }
    return this.getTimeProgressPercentage();
  }

  // Calcula el porcentaje de tiempo transcurrido para campañas con fecha límite
  getTimeProgressPercentage(): number {
    if (!this.campaign.goalDate) return 0;
    
    const now = new Date();
    const endDate = new Date(this.campaign.goalDate);
    const startDate = new Date(this.campaign.creationDate || now.setMonth(now.getMonth() - 1)); // Si no hay fecha inicio, asumimos 1 mes atrás
    
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