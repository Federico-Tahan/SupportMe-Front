import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Donation {
  projectIcon: string;
  projectName: string;
  comment: string;
  amount: string;
  date: string;
}

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
  imports: [CommonModule, CurrencyPipe],
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
  
  // Todas las donaciones
  allDonations: Donation[] = [
    {
      projectIcon: '/api/placeholder/60/60',
      projectName: 'El Amazonas arde: Salvemos el pulmón del planeta',
      comment: '"Gracias por el trabajo que hacen, sigamos luchando juntos."',
      amount: '$10,000.00 ARS',
      date: '03 May, 2025, 10:45 PM'
    },
    {
      projectIcon: '/api/placeholder/60/60',
      projectName: 'El Amazonas arde: Salvemos el pulmón del planeta',
      comment: '"Continuando con el apoyo a esta causa tan importante."',
      amount: '$10,000.00 ARS',
      date: '04 May, 2025, 12:17 AM'
    },
    {
      projectIcon: '/api/placeholder/60/60',
      projectName: 'El Amazonas arde: Salvemos el pulmón del planeta',
      comment: '"Pequeña contribución adicional."',
      amount: '$1,000.00 ARS',
      date: '04 May, 2025, 12:48 AM'
    },
    {
      projectIcon: '/api/placeholder/60/60',
      projectName: 'El Amazonas arde: Salvemos el pulmón del planeta',
      comment: '"Mi última donación para completar mi meta mensual."',
      amount: '$10,000.00 ARS',
      date: '04 May, 2025, 12:50 AM'
    },
    // Donaciones adicionales para demostrar "Ver más"
    {
      projectIcon: '/api/placeholder/60/60',
      projectName: 'Agua potable para comunidades rurales',
      comment: '"Feliz de apoyar esta iniciativa."',
      amount: '$5,000.00 ARS',
      date: '08 May, 2025, 9:30 AM'
    },
    {
      projectIcon: '/api/placeholder/60/60',
      projectName: 'Educación digital para niños',
      comment: '"Espero que ayude a mejorar el acceso a tecnología."',
      amount: '$8,000.00 ARS',
      date: '10 May, 2025, 3:15 PM'
    }
  ];
  
  // Donaciones visibles (limitadas o todas)
  get visibleDonations(): Donation[] {
    return this.showAllDonations ? this.allDonations : this.allDonations.slice(0, 3);
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
    // Aquí podrías cargar datos desde un servicio
    this.animateStatNumbers();
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
  
  // Método para alternar mostrar más/menos donaciones
  toggleDonations(): void {
    this.showAllDonations = !this.showAllDonations;
  }
}