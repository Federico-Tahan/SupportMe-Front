import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../core/shared/services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitted = false;
  recoveryError = false;
  errorMessage = '';
  isLoading = false;
  
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      this.isLoading = true;
      
      this.userService.forgotPassword(email)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: () => {
            this.isSubmitted = true;
            this.recoveryError = false;
          },
          error: (error) => {
            this.recoveryError = true;
            this.errorMessage = error.error?.message || 'Ha ocurrido un error al enviar el correo de recuperación';
          }
        });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
      this.recoveryError = true;
      this.errorMessage = 'Por favor, ingresa un correo electrónico válido';
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.forgotPasswordForm.reset();
  }
}