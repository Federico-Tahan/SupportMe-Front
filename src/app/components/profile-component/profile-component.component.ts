// profile-component.component.ts
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserToken } from '../../core/shared/interfaces/user-token';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/shared/services/auth.service';

@Component({
  selector: 'app-profile-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.scss']
})
export class ProfileComponentComponent implements OnInit {
  @Input() currentUser: UserToken;
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
  }

  getInitials(): string {
    if (!this.currentUser) return '?';
    
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    
    if (firstName) {
      return (firstName[0] )
    } else {
      return '?';
    }
  }
  
  async logout() {
    await this.authService.logout();    
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }
}