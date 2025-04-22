import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { LoadingSnipperComponent } from '../../../components/loading-snipper/loading-snipper.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingSnipperComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword = false;
  isLoading = false;
  loginError = false;
  errorMessage = '';
  form: FormGroup = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
    
    if (this.form.valid) {
      this.isLoading = true;
      this.loginError = false;
      const formValues = this.form.value;
      try {
        await this.authService.login(formValues.user, formValues.password);
        if (this.authService.checkJwt()) {
          this.router.navigate(['']);
        }
      } catch (error) {
        console.error('Error en login:', error);
        this.loginError = true;
        this.errorMessage = 'Correo electrónico o contraseña incorrectos';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
