// profile-component.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserToken } from '../../core/shared/interfaces/user-token';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.scss']
})
export class ProfileComponentComponent implements OnInit {
  @Input() currentUser: UserToken;
  @Output() logoutEvent = new EventEmitter<void>();

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  getInitials(): string {
    if (!this.currentUser) return '?';
    
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else {
      return '?';
    }
  }
  
  logout(): void {
    this.logoutEvent.emit();
  }
}