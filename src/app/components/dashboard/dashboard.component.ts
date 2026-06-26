import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardEvent } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {
  // Signals for state management
  isDialogOpen = signal<boolean>(false);
  partyCode = signal<string>('');
  isJoining = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  events = signal<DashboardEvent[]>([
    {
      id: 'EVT-001',
      title: 'DoorCode Launch Meetup',
      date: 'Thursday, July 15, 2026',
      location: 'Pune Basecamp Cafe',
      status: 'Upcoming',
      guests: 42,
    },
  ]);

  constructor(private router: Router) {}

  navigateToEvent(eventId: string): void {
    this.router.navigate(['/event-overview'], { queryParams: { eventId } });
  }

  openDialog(): void {
    this.isDialogOpen.set(true);
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.partyCode.set('');
    this.errorMessage.set(null);
  }

  joinEvent(): void {
    const code = this.partyCode().trim().toUpperCase();
    
    if (!code) {
      this.errorMessage.set('Please enter a valid party code.');
      return;
    }

    this.isJoining.set(true);
    this.errorMessage.set(null);

    // Simulated API Call to verify and join the event
    setTimeout(() => {
      if (code === 'DOOR2026') {
        // Success scenario
        console.log('Successfully joined event!');
        this.isJoining.set(false);
        this.closeDialog();
        // Here you would typically route to the specific event timeline view
      } else {
        // Error scenario
        this.isJoining.set(false);
        this.errorMessage.set('Invalid code. Please try again.');
      }
    }, 1200);
  }
}
