import { Component } from '@angular/core';
import { CardSettingsComponent } from "../card-settings/card-settings.component";
import { SettingsCard } from '../../../core/shared/interfaces/settingscard';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CardSettingsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  constructor() { }

  mainSettings: SettingsCard[] = [
    {
      title: 'Perfil',
      description: 'Ingresa a tu perfil, podrás ver un resumen de tus campañas y modificar tus datos',
      icon: 'user-circle',
      iconColor: 'purple',
      route: '/commission'
    },
    {
      title: 'Mercado Pago',
      description: 'Configura tus credenciales de Mercado Pago',
      icon: 'handshake',
      iconColor: 'purple',
      route: '/commission'
    },
    
  ];

  navigateTo(route: string): void {
    if (route) {
      console.log(`Navigating to ${route}`);
    }
  }
}
