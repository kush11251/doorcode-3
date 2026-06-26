import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LoginPayload } from '../../models/interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  loginForm: FormGroup;
  
  // Signals for handling loading state and error messages dynamically
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private api: ApiService, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Easy getters for template validation
  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: LoginPayload = this.loginForm.value;

    this.api.login(payload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.auth.saveSession(response);
        const redirectRoute = this.auth.getRedirectRouteForRole(response.user.role);
        this.router.navigate([redirectRoute]);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}
