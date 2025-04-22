import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { catchError, debounceTime, first, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoadingSnipperComponent } from "../../../components/loading-snipper/loading-snipper.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingSnipperComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  form: FormGroup;
  authService = inject(AuthService);
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  router = inject(Router);
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', 
        [Validators.required, Validators.email], 
        [this.emailAvailabilityValidator()]
      ),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required,
        this.ageValidator(18)]),
    }, { validators: this.passwordMatchValidator });
  }
  
  ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; 
      }
      
      const birthDate = new Date(control.value);
      
      if (isNaN(birthDate.getTime())) {
        return { invalidDate: true };
      }
      
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= minAge ? null : { minAge: { required: minAge, actual: age } };
    };
  }
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  emailAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.hasError('email') || control.hasError('required')) {
        return of(null);
      }
      
      return of(control.value).pipe(
        debounceTime(500),
        switchMap(email => {
          return this.authService.isAvailableEmail(email).pipe(
            map(response => {
              return response ? null : { emailTaken: true };
            }),
            catchError(() => {
              return of(null);
            }),
            first() 
          );
        })
      );
    };
  }
  
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const repassword = group.get('confirmPassword')?.value;
    
    return password === repassword ? null : { passwordMismatch: true };
  }
  
  onSubmit() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
    
    if (this.form.errors?.['passwordMismatch']) {
      document.getElementById('passwordError')!.style.display = 'block';
    } else {
      document.getElementById('passwordError')!.style.display = 'none';
    }
    
    if (this.form.valid) {
      this.isLoading = true;  // Mostrar loading
      const userData = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        dateOfBirth: this.form.value.dateOfBirth,
        email: this.form.value.email,
        password: this.form.value.password
      };
      
      this.authService.registerAccount(userData)
      .subscribe({
        next: (data) => {
          if(data) {
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
