import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  collapsed = false;
  
  projectName = 'SupportMe';
  
  navItems = [
    { icon: 'line-chart', label: 'Dashboard', route: '/dashboard' },
    { icon: 'bullhorn', label: 'Mis campañas', route: '/campaign' },
    { icon: 'credit-card', label: 'Pagos', route: '/payments' },
    { icon: 'gear', label: 'Configuración', route: '/settings', badge: 1 }
  ];
  
  labels = [
    { icon: 'motorcycle', label: 'Explorar campañas', route: '/' }
  ];
  
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
