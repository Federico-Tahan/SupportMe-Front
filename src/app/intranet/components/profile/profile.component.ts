import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentService } from '../../../core/shared/services/payment.service';
import { SimpleDonations } from '../../../core/shared/interfaces/simple-donations';

interface Campaign {
  rank: number;
  name: string;
  image: string;
  raised: number;
  goal: number;
  donors: number;
}

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
  // Inyección del servicio usando la nueva sintaxis de Angular
  private paymentService = inject(PaymentService);

  profileName: string = 'Fernando Gómez';
  profileEmail: string = 'fernando.gomez@email.com';
  hasProfileImage: boolean = false; // Control para mostrar iniciales o imagen
  showAllDonations: boolean = false; // Control para mostrar todas las donaciones
  
  // Calcular iniciales para el avatar
  get userInitials(): string {
    return this.profileName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 1)
      .toUpperCase();
  }
  
  stats = [
    { number: '4', label: 'Donaciones realizadas' },
    { number: '$31,000', label: 'Total donado (ARS)' },
    { number: 'Dic 2023', label: 'Miembro desde' },
  ];
  
  // Lista de donaciones que se llenará con el servicio
  donationsList: SimpleDonations[] = [];
  
  // Parámetros para paginación
  currentPage: number = 0;
  pageSize: number = 5;
  hasMoreDonations: boolean = true;
  isLoadingDonations: boolean = false;

  // Getter para mostrar donaciones visibles
  get visibleDonations(): SimpleDonations[] {
    return this.donationsList;
  }

  // Top 5 campañas con mayor recaudación
  topCampaigns: Campaign[] = [
    {
      rank: 1,
      name: 'Salvemos el Amazonas: Reforestación urgente',
      image: '/api/placeholder/60/60',
      raised: 45000000,
      goal: 50000000,
      donors: 1245
    },
    {
      rank: 2,
      name: 'Agua potable para comunidades rurales de Córdoba',
      image: '/api/placeholder/60/60',
      raised: 28700000,
      goal: 35000000,
      donors: 876
    },
    {
      rank: 3,
      name: 'Educación digital para niños en situación vulnerable',
      image: '/api/placeholder/60/60',
      raised: 21500000,
      goal: 25000000,
      donors: 734
    },
    {
      rank: 4,
      name: 'Conservación del yaguareté: Especies en peligro',
      image: '/api/placeholder/60/60',
      raised: 15800000,
      goal: 20000000,
      donors: 523
    },
    {
      rank: 5,
      name: 'Energía solar para escuelas rurales argentinas',
      image: '/api/placeholder/60/60',
      raised: 12300000,
      goal: 18000000,
      donors: 411
    }
  ];

  ngOnInit(): void {
    // Cargar los datos iniciales de donaciones
    this.loadDonations();
    
    // Animar números de estadísticas
    this.animateStatNumbers();
  }

  // Método para cargar donaciones usando el servicio
  loadDonations(): void {
    if (!this.hasMoreDonations || this.isLoadingDonations) return;
    
    this.isLoadingDonations = true;
    
    this.paymentService.getDonationsPayments(this.currentPage * this.pageSize, this.pageSize)
      .subscribe({
        next: (donations) => {
          // Si recibimos menos elementos que el tamaño de página, no hay más que cargar
          if (donations.length < this.pageSize) {
            this.hasMoreDonations = false;
          }
          
          // Agregar las nuevas donaciones a la lista existente
          this.donationsList = [...this.donationsList, ...donations];
          
          // Actualizar estadísticas si es necesario
          if (this.currentPage === 0) {
            this.stats[0].number = this.donationsList.length.toString();
          }
          
          this.isLoadingDonations = false;
        },
        error: (error) => {
          console.error('Error al cargar donaciones:', error);
          this.isLoadingDonations = false;
        }
      });
  }

  // Método para cargar más donaciones
  loadMoreDonations(): void {
    this.currentPage++;
    this.loadDonations();
  }

  // Función para animar los números de estadísticas
  animateStatNumbers(): void {
    // Esta función se implementaría con una librería como countUp.js
    console.log('Animando números de estadísticas');
  }
  
  // Cálculo del porcentaje de progreso para las barras
  calculateProgress(raised: number, goal: number): number {
    const percentage = (raised / goal) * 100;
    return Math.min(percentage, 100); // Asegurarse de que no exceda el 100%
  }
  
  // Método para editar perfil
  editProfile(): void {
    console.log('Editando perfil');
    // Aquí se implementaría la lógica para editar el perfil
  }
  
  // Método para formatear grandes cantidades de dinero
  formatLargeAmount(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  }
}