// side-bar.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  collapsed = false;
  isMobile = false;
  
  projectName = 'SupportMe';
  
  navItems = [
    { icon: 'line-chart', label: 'Dashboard', route: '/dashboard' },
    { icon: 'bullhorn', label: 'Mis campañas', route: '/campaign' },
    { icon: 'credit-card', label: 'Pagos', route: '/payments' },
    { icon: 'gear', label: 'Configuración', route: '/settings' }
  ];
  
  labels = [
    { icon: 'motorcycle', label: 'Explorar campañas', route: '/' }
  ];
  
  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Common breakpoint for mobile
    if (this.isMobile) {
      this.collapsed = true; // Force collapsed state on mobile
    }
  }
  
  toggleSidebar() {
    // Only allow toggling if not on mobile
    if (!this.isMobile) {
      this.collapsed = !this.collapsed;
    }
  }
}