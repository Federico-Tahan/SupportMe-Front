import { Component, inject, OnInit } from '@angular/core';
import { UserToken } from '../../../core/shared/interfaces/user-token';
import { AuthService } from '../../../core/shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponentComponent } from '../../../components/profile-component/profile-component.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ProfileComponentComponent, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserToken | null = null;
  authService = inject(AuthService);

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
        this.authService.userChanges$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  private loadUser(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson) as UserToken;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }
  
  async onLogout() {
    await this.authService.logout();
    this.currentUser = null;
  }
}