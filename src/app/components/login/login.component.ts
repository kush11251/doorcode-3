import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
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

    // Simulated API Authentication Call
    setTimeout(() => {
      const { email, password } = this.loginForm.value;
      
      // Mock Authentication Check
      if (email === 'organizer@doorcode.com' && password === 'password123') {
        this.isLoading.set(false);
        // Navigate to the organizer dashboard
        this.router.navigate(['/dashboard']); 
      } else if (email === 'attendee@doorcode.com' && password === 'password123') {
        this.isLoading.set(false);
        // Navigate to the attendee event flow
        this.router.navigate(['/join-event']); 
      } else {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password. Try organizer@doorcode.com');
      }
    }, 1500);
  }
}
