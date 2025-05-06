// profile.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Donation {
  projectIcon: string;
  projectName: string;
  comment: string;
  amount: string;
  date: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
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
}