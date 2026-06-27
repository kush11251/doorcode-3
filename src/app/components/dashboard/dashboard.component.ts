import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardEvent } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  // Signals for state management
  isDialogOpen = signal<boolean>(false);
  partyCode = signal<string>('');
  isJoining = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  events = signal<DashboardEvent[]>([
    {
      id: 'EVT-001',
      eventCode: 'DOOR2026',
      title: 'DoorCode Launch Meetup',
      date: 'Thursday, July 15, 2026',
      location: 'Pune Basecamp Cafe',
      status: 'Upcoming',
      guests: 42,
    },
  ]);

  constructor(private router: Router, private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadUserEvents();
  }

  navigateToEvent(eventId: string): void {
    this.api.getEventById(eventId).subscribe({
      next: (response) => {
        const event = response.data;
        this.router.navigate(['/event-overview'], {
          queryParams: { eventId },
          state: {
            eventData: {
              title: event.title,
              organizer: event.organizer,
              date: event.date,
              time: event.time,
              startDateTime: event.startDateTime,
              location: event.location,
              address: event.address,
              dressCode: event.dressCode,
              description: event.description,
              activities: event.activities.map(activity => ({
                time: activity.time,
                name: activity.name,
                description: activity.description
              }))
            }
          }
        });
      },
      error: (err) => {
        console.error('Failed to load event details:', err);
        this.router.navigate(['/event-overview'], { queryParams: { eventId } });
      }
    });
  }

  openDialog(): void {
    this.isDialogOpen.set(true);
  }

  private loadUserEvents(): void {
    const userId = this.auth.getUser()?.id;
    if (!userId) {
      return;
    }

    this.api.getEventsByUser(userId).subscribe({
      next: (response) => {
        const mapped = response.data.map(event => ({
          id: event.eventId || event._id,
          eventCode: event.eventCode || event.eventId || event._id,
          title: event.title,
          date: event.date,
          location: event.location,
          status: 'Upcoming',
          guests: event.inviteeIds?.length ?? 0
        }));
        this.events.set(mapped);
      },
      error: (err) => {
        console.error('Failed to load user dashboard events:', err);
      }
    });
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

    this.api.joinEvent({ eventCode: code }).subscribe({
      next: (response) => {
        const joinedEvent = response.data;
        const eventId = joinedEvent.eventId || joinedEvent._id;

        this.events.update(events => {
          const alreadyJoined = events.some(event => event.id === eventId);
          if (alreadyJoined) {
            return events;
          }
          return [
            ...events,
            {
              id: eventId,
              eventCode: joinedEvent.eventCode,
              title: joinedEvent.title,
              date: joinedEvent.date,
              location: joinedEvent.location,
              status: 'Upcoming',
              guests: joinedEvent.inviteeIds?.length ?? 0
            }
          ];
        });

        this.isJoining.set(false);
        this.closeDialog();
        this.loadUserEvents();
      },
      error: (err) => {
        this.isJoining.set(false);
        this.errorMessage.set(err?.error?.message || 'Unable to join event. Please check the code and try again.');
        console.error('Failed to join event:', err);
      }
    });
  }
}
