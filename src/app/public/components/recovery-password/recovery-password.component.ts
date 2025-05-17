import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingSnipperComponent } from '../../../components/loading-snipper/loading-snipper.component';
import { UserService } from '../../../core/shared/services/user.service';
import { UserRecoveryData } from '../../../core/shared/interfaces/user-recovery-data';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSnipperComponent],
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css']
})
export class RecoveryPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  
  token: string = '';
  rawToken: string = ''; // Token sin decodificar
  userData: UserRecoveryData | null = null;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  error: boolean = false;
  errorMessage: string = '';
  success: boolean = false;

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { 
    validators: this.passwordMatchValidator
  });

  ngOnInit(): void {
    // Obtenemos el token directamente de la URL para evitar la decodificación automática
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.rawToken = urlParams.get('token') || '';
    this.token = this.rawToken; // Guardamos también el token decodificado para otros usos si fuera necesario
    
    if (!this.rawToken) {
      this.error = true;
      this.errorMessage = 'Token no válido o expirado';
      return;
    }
    
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    
    // Consola informativa para depuración (puedes eliminarla en producción)
    console.log('Enviando token sin procesar:', this.rawToken);
    console.log('URL que se enviará:', `${environment.backApi}user/password/user/data?token=${this.rawToken}`);
    
    this.userService.getRecoveryDataUser(this.rawToken).subscribe({
      next: (data: UserRecoveryData) => {
        this.userData = data;
        this.isLoading = false;
        console.log('Datos recuperados correctamente:', data);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = true;
        this.errorMessage = 'Error al recuperar los datos del usuario. El token podría haber expirado.';
        console.error('Error al recuperar datos de usuario:', err);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ notMatch: true });
      return { notMatch: true };
    }
    
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const newPassword = this.form.get('password')?.value;
    
    // Consola informativa para depuración (puedes eliminarla en producción)
    console.log('Enviando token sin procesar:', this.rawToken);
    console.log('Contraseña a enviar:', newPassword);
    console.log('URL que se enviará:', `${environment.backApi}user/password/change?token=${this.rawToken}&newpassword=[password-oculto]`);

    this.userService.changePassword(this.rawToken, newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
        console.log('Contraseña cambiada con éxito');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = true;
        this.errorMessage = 'Error al cambiar la contraseña. Por favor, inténtelo de nuevo.';
        console.error('Error al cambiar la contraseña:', err);
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}