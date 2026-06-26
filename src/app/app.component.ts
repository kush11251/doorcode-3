import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthUser } from './models/interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'doorcode-3';
  showHeader = signal(true);
  loggedIn = signal(false);
  userInitials = signal('');

  constructor(private router: Router, private auth: AuthService) {
    this.auth.initExpiryWatcher(this.router);
    this.updateHeaderState(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const path = event.urlAfterRedirects.split('?')[0].split('#')[0];
        this.updateHeaderState(path);
      }
    });
  }

  private updateHeaderState(path: string): void {
    this.showHeader.set(path !== '/');
    const user = this.auth.getUser();
    const logged = this.auth.isAuthenticated();
    this.loggedIn.set(logged);
    this.userInitials.set(logged ? this.extractInitials(user) : '');
  }

  private extractInitials(user: AuthUser | null): string {
    if (!user) {
      return 'JD';
    }

    const first = user.firstName?.trim() || '';
    const last = user.lastName?.trim() || '';
    if (first || last) {
      return `${first.charAt(0) || ''}${last.charAt(0) || ''}`.toUpperCase();
    }

    const email = user.email?.trim() || '';
    if (email) {
      const namePart = email.split('@')[0];
      const parts = namePart.split(/[._-]/).filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return namePart.slice(0, 2).toUpperCase();
    }

    return 'JD';
  }
}
