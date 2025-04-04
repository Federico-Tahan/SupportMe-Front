import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService = inject(AuthService);
  router : Router = inject(Router);
  showPassword: boolean = false;

  form : FormGroup = new FormGroup({
    user : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required])
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(){
    
    const form = this.form.value;
    await this.authService.login(form.user, form.password);


  }
}
