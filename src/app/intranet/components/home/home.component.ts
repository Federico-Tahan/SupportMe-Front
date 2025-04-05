import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/shared/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  authService = inject(AuthService);

  async logOut(){  
    await this.authService.logout();    
  }
}
