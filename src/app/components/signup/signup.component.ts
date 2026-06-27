import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SignupPayload } from '../../models/interfaces';

// Custom Validator for matching passwords
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    // Set error on the confirmPassword control specifically for easier UI binding
    confirmPassword.setErrors({ ...confirmPassword.errors, passwordsMismatch: true });
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styles: ``
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private api: ApiService, private auth: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator });
  }

  // Easy getter for template validation
  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: SignupPayload = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      phoneNumber: this.signupForm.value.mobile,
      password: this.signupForm.value.password,
      role: 'user'
    };

    this.api.signup(payload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.auth.saveSession(response);
        const redirectRoute = this.auth.getRedirectRouteForRole(response.user.role);
        this.router.navigate([redirectRoute]);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Signup failed. Please try again.');
      }
    });
  }
}
