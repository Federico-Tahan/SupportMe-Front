// campaign-donation.component.ts
import { Component, ElementRef, Input, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleCategory } from '../../../core/shared/interfaces/simple-category';

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
  @Input() category : string = null;
  @Input() tags : string[] = null;
  @ViewChild('tagsContainer') tagsContainer: ElementRef;
  @Input() title : string = null;
  @Input() amountRaised : number = null;
  @Input() goalAmount : number = null;
  progressPercentage = (this.amountRaised / this.goalAmount) * 100;
  @Input() donationCount = 0;
  canScrollLeft = false;
  canScrollRight = false;
  @Input() recentDonations: RecentDonation[] = [
    //{ name: 'William Davis', amount: 20, timeAgo: '4d' },
    //{ name: 'Paula Martinez', amount: 10, timeAgo: '4d' },
    //{ name: 'John Smith', amount: 50, timeAgo: '4d' },
    //{ name: 'Elizabeth Watson', amount: 100, timeAgo: '4d' }
  ];
  
  donate(): void {
    alert('Redirigiendo a la página de pago...');
  }
  
  share(): void {
    alert('Compartiendo campaña...');
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