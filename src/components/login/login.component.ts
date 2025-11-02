import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: [{ value: 'admin@ultrasound.ai', disabled: true }, [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  error = signal<string | null>(null);
  isLoggingIn = signal(false);

  onSubmit() {
    this.isLoggingIn.set(true);
    this.error.set(null);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.isLoggingIn.set(false);
      return;
    }

    const { password } = this.loginForm.getRawValue();

    // Simulate network delay for realistic UX
    setTimeout(() => {
      const success = this.authService.login(password!);
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.error.set('Invalid credentials. Please try again.');
        this.isLoggingIn.set(false);
        this.loginForm.get('password')?.reset();
      }
    }, 500);
  }
}