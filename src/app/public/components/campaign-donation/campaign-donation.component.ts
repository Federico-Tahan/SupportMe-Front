// campaign-donation.component.ts
import { Component, ElementRef, Input, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleCategory } from '../../../core/shared/interfaces/simple-category';
import { RouterLink } from '@angular/router';

interface RecentDonation {
  name: string;
  amount: number;
  timeAgo: string;
}

@Component({
  selector: 'app-campaign-donation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './campaign-donation.component.html',
  styleUrl: './campaign-donation.component.scss'
})
export class CampaignDonationComponent {
  @Input() category : string = null;
  @Input() tags : string[] = null;
  @ViewChild('tagsContainer') tagsContainer: ElementRef;
  @Input() title : string = null;
  @Input() campaignId : number = null;
  @Input() amountRaised : number = null;
  @Input() goalAmount : number = null;
  get percentageRaised(): number {
    if (!this.goalAmount || this.goalAmount === 0) return 0;
    return (this.amountRaised / this.goalAmount) * 100;
  }
 @Input() donationCount = 0;
  canScrollLeft = false;
  canScrollRight = false;
  @Input() recentDonations: RecentDonation[] = [
  ];
  
  
  share(): void {
    console.log(this.percentageRaised);
  }

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
}