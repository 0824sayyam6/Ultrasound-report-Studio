import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  isLoggedIn = signal<boolean>(sessionStorage.getItem('isLoggedIn') === 'true');

  // In a real app, this should be a secret from an environment variable.
  // The prompt specifies this password for the exercise.
  private readonly ADMIN_PASSWORD = '2025lab5';

  login(password: string): boolean {
    if (password === this.ADMIN_PASSWORD) {
      this.isLoggedIn.set(true);
      sessionStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    this.isLoggedIn.set(false);
    sessionStorage.removeItem('isLoggedIn');
    return false;
  }

  logout(): void {
    this.isLoggedIn.set(false);
    sessionStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}