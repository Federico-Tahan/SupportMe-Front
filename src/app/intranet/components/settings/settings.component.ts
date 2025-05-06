import { Component, inject } from '@angular/core';
import { CardSettingsComponent } from "../card-settings/card-settings.component";
import { SettingsCard } from '../../../core/shared/interfaces/settingscard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CardSettingsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  router = inject(Router);
  constructor() { }

  mainSettings: SettingsCard[] = [
    {
      title: 'Perfil',
      description: 'Ingresa a tu perfil, podrás ver un resumen de tus campañas y modificar tus datos',
      icon: 'user-circle',
      iconColor: 'purple',
      route: '/profile'
    },
    {
      title: 'Mercado Pago',
      description: 'Configura tus credenciales de Mercado Pago',
      icon: 'handshake',
      iconColor: 'purple',
      route: '/setup/mercadopago'
    },
    
  ];

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
