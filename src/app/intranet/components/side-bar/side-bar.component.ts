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
    { icon: 'hand-holding-heart', label: 'Explorar campañas', route: '/projects' }
  ];
  
  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.collapsed = true;
    }
  }
  
  toggleSidebar() {
    if (!this.isMobile) {
      this.collapsed = !this.collapsed;
    }
  }
}