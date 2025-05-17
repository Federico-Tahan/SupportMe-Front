import { Component, inject, OnInit } from '@angular/core';
import { ProfileComponentComponent } from "../../../components/profile-component/profile-component.component";
import { UserToken } from '../../../core/shared/interfaces/user-token';
import { AuthService } from '../../../core/shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-intra',
  standalone: true,
  imports: [ProfileComponentComponent, CommonModule],
  templateUrl: './navbar-intra.component.html',
  styleUrls: ['./navbar-intra.component.scss']
})
export class NavbarIntraComponent implements OnInit {
  currentUser: UserToken;
  authService = inject(AuthService);

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson) as UserToken;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }  
  }
  
  async onLogout() {
    await this.authService.logout();    
    localStorage.removeItem('user');
  }
}