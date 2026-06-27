import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity, EventDetails, TimelineEvent } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-event-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-timeline.component.html',
  styles: ``
})
export class EventTimelineComponent implements OnInit {
  eventData = signal<EventDetails | null>(null);
  timelineEvents = signal<TimelineEvent[]>([]);

  private querySub: any;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.querySub = this.route.queryParams.subscribe(params => {
      const eventId = params['eventId'] as string | undefined;
      const historyState = window.history.state as { eventData?: EventDetails };

      if (historyState?.eventData) {
        this.setEventData(historyState.eventData);
      } else if (eventId) {
        this.api.getEventById(eventId).subscribe({
          next: response => {
            this.setEventData({
              title: response.data.title,
              organizer: response.data.organizer,
              date: response.data.date,
              time: response.data.time,
              startDateTime: response.data.startDateTime,
              location: response.data.location,
              address: response.data.address,
              dressCode: response.data.dressCode,
              description: response.data.description,
              activities: response.data.activities.map(activity => ({
                time: activity.time,
                name: activity.name,
                description: activity.description
              }))
            });
          },
          error: err => {
            console.error('Failed to load timeline event data:', err);
          }
        });
      }
    });
  }

  private setEventData(event: EventDetails): void {
    this.eventData.set(event);
    this.timelineEvents.set(event.activities.map((activity, index) => ({
      id: String(index + 1),
      startTime: activity.time,
      endTime: activity.time,
      title: activity.name,
      description: activity.description,
      type: 'session',
      speaker: undefined,
      location: event.location
    })));
  }

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();
  }
}
