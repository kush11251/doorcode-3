import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Activity, Countdown, EventDetails, EventDetailsResponse } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-overview.component.html',
  styles: ``
})
export class EventOverviewComponent implements OnInit, OnDestroy {
  // Signal holding the event data
  eventData = signal<EventDetails>({
    title: 'Pre-Trek Tech Sync & Gear Check',
    organizer: 'High-Altitude Coders Group',
    date: 'Saturday, July 4, 2026',
    time: '10:00 AM - 4:00 PM IST',
    startDateTime: '2026-07-04T10:00:00+05:30',
    location: 'Pune Basecamp Cafe',
    address: 'Viman Nagar, Pune, Maharashtra, India',
    dressCode: 'Smart Casual or Comfortable Trekking Gear',
    description: 'Join us for our final alignment meeting before the upcoming expedition. We will be doing a comprehensive gear check, mapping out our offline GPS routes, and reviewing the custom tracker app deployment.',
    activities: [
      {
        time: '10:00 AM',
        name: 'Welcome & Route Mapping',
        description: 'Coffee and a walkthrough of the digital trail maps on the big screen.'
      },
      {
        time: '11:30 AM',
        name: 'Physical Gear Inspection',
        description: 'Ensure all cold-weather gear, boots, and safety equipment meet requirements.'
      },
      {
        time: '1:00 PM',
        name: 'Lunch Break',
        description: 'High-protein lunch provided by the venue.'
      },
      {
        time: '2:30 PM',
        name: 'Tech Deployment',
        description: 'Installing the custom offline tracking application on all peer devices and testing satellite pings.'
      }
    ]
  });

  countdown = signal<Countdown>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    expired: false,
  });

  eventId = signal<string>('');
  private timerRef: number | null = null;
  private querySub: Subscription | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.querySub = this.route.queryParams.subscribe(params => {
      const eventId = params['eventId'];
      if (!eventId) {
        console.error('No eventId query parameter found for event overview.');
        return;
      }
      this.eventId.set(eventId);
      this.loadEventDetails(eventId);
    });
  }

  ngOnDestroy(): void {
    if (this.timerRef !== null) {
      window.clearInterval(this.timerRef);
    }
    this.querySub?.unsubscribe();
  }

  private updateCountdown(target: Date): void {
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      this.countdown.set({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        expired: true,
      });
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.countdown.set({
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      expired: false,
    });
  }

  private loadEventDetails(eventId: string): void {
    this.api.getEventById(eventId).subscribe({
      next: (response: EventDetailsResponse) => {
        const event = response.data;
        this.eventData.set({
          title: event.title,
          organizer: event.organizer,
          date: event.date,
          time: event.time,
          startDateTime: event.startDateTime,
          location: event.location,
          address: event.address,
          dressCode: event.dressCode,
          description: event.description,
          activities: event.activities.map((activity) => ({
            time: activity.time,
            name: activity.name,
            description: activity.description
          }))
        });
        this.startCountdown(event.startDateTime);
      },
      error: (err) => {
        console.error('Failed to fetch event overview:', err);
      }
    });
  }

  viewFullTimeline(): void {
    const eventId = this.eventId();
    if (!eventId) {
      return;
    }

    this.router.navigate(['/event-timeline'], {
      queryParams: { eventId },
      state: { eventData: this.eventData() }
    });
  }

  private startCountdown(startDateTime: string): void {
    if (this.timerRef !== null) {
      window.clearInterval(this.timerRef);
    }
    const target = new Date(startDateTime);
    this.updateCountdown(target);
    this.timerRef = window.setInterval(() => this.updateCountdown(target), 1000);
  }
}
