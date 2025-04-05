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
    { icon: 'motorcycle', label: 'Dasborad', route: '/backlog' },
    { icon: 'motorcycle', label: 'Board', route: '/board' },
    { icon: 'motorcycle', label: 'Report', route: '/report' },
    { icon: 'motorcycle', label: 'Inbox', route: '/inbox', badge: 8 },
    { icon: 'motorcycle', label: 'Settings', route: '/settings' }
  ];
  
  labels = [
    { icon: 'motorcycle', label: 'Explorar campañas', route: '/' }
  ];
  
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
