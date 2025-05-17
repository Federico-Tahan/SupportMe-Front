import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentService } from '../../../core/shared/services/payment.service';
import { SimpleDonations } from '../../../core/shared/interfaces/simple-donations';
import { UserService } from '../../../core/shared/services/user.service';
import { UserProfile } from '../../../core/shared/interfaces/user-profile';
import { CampaignService } from '../../../core/shared/services/campaign.service';
import { Campaign } from '../../../core/shared/interfaces/campaign';

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
  // Inyección de servicios usando la nueva sintaxis de Angular
  private paymentService = inject(PaymentService);
  private userService = inject(UserService);
  private campaignService = inject(CampaignService);

  // Datos del perfil del usuario
  userProfile: UserProfile | null = null;
  hasProfileImage: boolean = false;
  showAllDonations: boolean = false;
  isLoadingProfile: boolean = false;
  
  // Getter para mostrar el nombre completo
  get profileName(): string {
    if (this.userProfile) {
      return `${this.userProfile.name} ${this.userProfile.lastName}`;
    }
    return '';
  }
  
  // Getter para mostrar el email
  get profileEmail(): string {
    return this.userProfile?.email || '';
  }
  
  // Calcular iniciales para el avatar
  get userInitials(): string {
    if (this.userProfile) {
      const firstInitial = this.userProfile.name.charAt(0);
      return (firstInitial).toUpperCase();
    }
    return '';
  }
  
  // Estadísticas actualizadas desde la API
  get stats() {
    return [
      { number: this.userProfile?.donationsCount.toString() || '0', label: 'Donaciones realizadas' },
      { number: `$${this.formatLargeAmount(this.userProfile?.totalDonated || 0)}`, label: 'Total donado (ARS)' },
      { 
        number: this.userProfile ? 
          new Date(this.userProfile.createdDate).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }) : 
          '-', 
        label: 'Miembro desde' 
      },
    ];
  }
  
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

  // Top campañas con mayor recaudación
  topCampaigns: Campaign[] = [];
  isLoadingCampaigns: boolean = false;
  
  // Verificar si tenemos campañas para mostrar
  get hasCampaigns(): boolean {
    return this.topCampaigns.length > 0;
  }

  ngOnInit(): void {
    // Cargar datos del perfil del usuario
    this.loadUserProfile();
    
    // Cargar los datos iniciales de donaciones
    this.loadDonations();
    
    // Cargar las campañas con mayor recaudación
    this.loadTopCampaigns();
    
    // Animar números de estadísticas
    this.animateStatNumbers();
  }

  // Método para cargar el perfil del usuario
  loadUserProfile(): void {
    this.isLoadingProfile = true;
    
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.hasProfileImage = !!profile.profilePc; // Verificar si hay imagen de perfil
        this.isLoadingProfile = false;
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.isLoadingProfile = false;
      }
    });
  }
  
  // Método para cargar las campañas con mayor recaudación
  loadTopCampaigns(): void {
    this.isLoadingCampaigns = true;
    
    this.campaignService.getMostRaisedCampaigns().subscribe({
      next: (campaigns) => {
        // Ordenar campañas por monto recaudado (de mayor a menor)
        const sortedCampaigns = campaigns.sort((a, b) => b.raised - a.raised);
        
        // Obtener las 5 primeras campañas (o menos si no hay 5)
        this.topCampaigns = sortedCampaigns.slice(0, 5);
        this.isLoadingCampaigns = false;
      },
      error: (error) => {
        console.error('Error al cargar las campañas:', error);
        this.isLoadingCampaigns = false;
      }
    });
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