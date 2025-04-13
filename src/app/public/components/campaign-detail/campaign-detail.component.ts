// campaign-detail.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignDonationComponent } from "../campaign-donation/campaign-donation.component";

interface SupportMessage {
  name: string;
  time: string;
  message: string;
}

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule, CampaignDonationComponent],
  templateUrl: './campaign-detail.component.html',
  styleUrl: './campaign-detail.component.scss'
})
export class CampaignDetailComponent implements AfterViewInit {
  @ViewChild('thumbnailsContainer') thumbnailsContainer!: ElementRef;
  
  title = 'Empower a Girl: For Self-Reliance';
  description = 'Participe commodo non dolor est aliqua irure adipisicing nisi qui officia proident Lorem sit qui sunt ullamco Lorem tempor. Ullamco nisi enim ipsum nulla reprehenderit incididunt ad voluptate voluptate. Quis ea enim duis exercitation culpa ex adipisicing occaecat labore dolore ea minim Pariatur aliqua deserunt eu et ea enim occaecat vel cupidatat anim do laboris veniam non aute reprehenderit exercitation. Culpa et culpa do lorem aute aliquip consequat ex aute incididunt veniam adipiscing et. Aliquip et culpa do ipsum aute incididunt Lorem ex. Duis aute et labore magna tempor qut exercitation mollit minim deserut.';
  
  supportMessages: SupportMessage[] = [
    {
      name: 'Natalia Lopez',
      time: '5d',
      message: 'Every girl should have the opportunity to develop emotionally, socially, and academically without financial obstacles.'
    },
    {
      name: 'Betina Lopez',
      time: '2hrs',
      message: 'Such a powerful initiative that provides girls with tools for an excellent future ensuring sustainability and development opportunities.'
    },
    {
      name: 'Martha Williams',
      time: '8hrs',
      message: 'I\'m proud to contribute to education for these incredible children. Education means freedom and open doors.'
    }
  ];
  
  // Thumbnails para demostrar el desplazamiento
  thumbnails = Array(12).fill(0).map(() => 
    'https://images.gofundme.com/wzp5GbOwQV0PtUNjtXiDgfug0-Y=/720x405/https://d2g8igdw686xgo.cloudfront.net/90033415_1743632985513988_r.png'
  );
  
  mainImage = 'https://images.gofundme.com/wzp5GbOwQV0PtUNjtXiDgfug0-Y=/720x405/https://d2g8igdw686xgo.cloudfront.net/90033415_1743632985513988_r.png';
  
  // Propiedades para controlar el scroll
  canScrollLeft = false;
  canScrollRight = true;
  
  changeThumbnail(index: number): void {
    this.mainImage = this.thumbnails[index];
  }
  
  donate(): void {
    console.log('Redirigiendo a la página de pago...');
  }
  
  share(): void {
    console.log('Compartiendo campaña...');
  }
  
  ngAfterViewInit(): void {
    // Usar setTimeout para asegurarse que el DOM está completamente renderizado
    setTimeout(() => {
      this.checkScrollButtons();
      
      // Añadir listener para redimensionamiento
      window.addEventListener('resize', () => {
        this.checkScrollButtons();
      });
    }, 100);
  }
  
  scrollThumbnails(direction: 'left' | 'right'): void {
    if (!this.thumbnailsContainer) return;
    
    const element = this.thumbnailsContainer.nativeElement;
    const scrollAmount = element.clientWidth / 2; // Scroll medio contenedor
    
    if (direction === 'left') {
      element.scrollLeft -= scrollAmount;
    } else {
      element.scrollLeft += scrollAmount;
    }
    
    // Actualizar la visibilidad de los botones después del desplazamiento
    setTimeout(() => {
      this.checkScrollButtons();
    }, 300);
  }
  
  checkScrollButtons(): void {
    if (!this.thumbnailsContainer) return;
    
    const element = this.thumbnailsContainer.nativeElement;
    
    // Verificar si se puede desplazar a la izquierda
    this.canScrollLeft = element.scrollLeft > 0;
    
    // Verificar si se puede desplazar a la derecha
    const hasMoreToScroll = element.scrollWidth > element.clientWidth + element.scrollLeft;
    this.canScrollRight = hasMoreToScroll;
    
    console.log({
      scrollLeft: element.scrollLeft,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      canScrollLeft: this.canScrollLeft,
      canScrollRight: this.canScrollRight
    });
  }
}