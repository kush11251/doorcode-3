import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthResponse, AuthSession, AuthUser } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'doorcodeAuth';
  private readonly sessionDurationMs = 30 * 60 * 1000; // 30 minutes

  saveSession(response: AuthResponse): void {
    if (!response.token || !response.user) {
      return;
    }

    const session: AuthSession = {
      token: response.token,
      user: {
        id: response.user.userId,
        firstName: response.user.firstName,
        lastName: response.user.lastName ?? '',
        email: response.user.email,
        role: response.user.role,
        phoneNumber: response.user.phoneNumber ?? null
      },
      expiresAt: Date.now() + this.sessionDurationMs
    };

    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  getSession(): AuthSession | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const session = JSON.parse(raw) as AuthSession;
      if (!session || !session.token || !session.user || !session.expiresAt) {
        this.clearSession();
        return null;
      }

      if (Date.now() >= session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  getUser(): AuthUser | null {
    return this.getSession()?.user ?? null;
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  clearSession(): void {
    localStorage.removeItem(this.storageKey);
  }

  getRedirectRouteForRole(role: string): string {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'organizer':
        return '/organizer-dashboard';
      default:
        return '/dashboard';
    }
  }

  initExpiryWatcher(router: Router): void {
    const checkSession = () => {
      if (!this.getSession()) {
        const currentPath = router.url.split('?')[0].split('#')[0];
        if (!['/', '/login', '/signup'].includes(currentPath)) {
          router.navigate(['/login']);
        }
      }
    };

    checkSession();

    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      checkSession();
    });
  }
}
