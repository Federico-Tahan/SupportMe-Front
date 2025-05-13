// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

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
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileName: string = 'Fernando Gómez';
  profileEmail: string = 'fernando.gomez@email.com';
  
  stats = [
    { number: '4', label: 'Donaciones realizadas' },
    { number: '$31,000', label: 'Total donado (ARS)' },
    { number: 'Dic 2023', label: 'Miembro desde' },
  ];
  
  donations: Donation[] = [
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
    }
  ];

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
}