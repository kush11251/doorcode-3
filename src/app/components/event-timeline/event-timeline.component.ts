import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEvent } from '../../models/interfaces';

@Component({
  selector: 'app-event-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-timeline.component.html',
  styles: ``
})
export class EventTimelineComponent {
  // Signal holding the timeline data
  timelineEvents = signal<TimelineEvent[]>([
    {
      id: '1',
      startTime: '13:00',
      endTime: '14:00',
      title: 'Doors Open & Registration',
      description: 'Check in using your DoorCode QR, grab your badge, and enjoy some light refreshments before the main event.',
      type: 'session',
      location: 'Main Lobby'
    },
    {
      id: '2',
      startTime: '14:00',
      endTime: '15:00',
      title: 'Opening Keynote: The Future of AI',
      description: 'A deep dive into how artificial intelligence is reshaping hyper-local commerce and event management.',
      type: 'keynote',
      speaker: 'Jane Doe, CEO',
      location: 'Auditorium A'
    },
    {
      id: '3',
      startTime: '15:00',
      endTime: '15:30',
      title: 'Networking Break',
      type: 'break'
    },
    {
      id: '4',
      startTime: '15:30',
      endTime: '17:00',
      title: 'Technical Workshop: Angular 18 & Signals',
      description: 'Interactive session on building high-performance progressive web apps.',
      type: 'session',
      speaker: 'Alex Smith, Principal Engineer',
      location: 'Workshop Room 1'
    }
  ]);
}
