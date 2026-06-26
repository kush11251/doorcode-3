import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OrganizerEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'Published' | 'Draft' | 'Completed';
  attendeeCount: number;
}

export interface Invitee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  status: 'Attending' | 'Pending' | 'Declined';
  checkInStatus: boolean;
}

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-dashboard.component.html',
  styles: ``
})
export class OrganizerDashboardComponent {
  // Navigation State
  activeTab = signal<'events' | 'invitees' | 'analytics'>('events');

  // Mock Data Signals
  events = signal<OrganizerEvent[]>([
    {
      id: 'EVT-101',
      name: 'Kedarnath Post-Trek Reunion',
      date: 'July 15, 2026',
      location: 'Pune Basecamp Cafe',
      status: 'Published',
      attendeeCount: 14
    },
    {
      id: 'EVT-102',
      name: 'Angular 18 & Signals Masterclass',
      date: 'August 10, 2026',
      location: 'Tech Hub, Viman Nagar',
      status: 'Draft',
      attendeeCount: 0
    }
  ]);

  invitees = signal<Invitee[]>([
    { id: 'INV-001', eventId: 'EVT-101', name: 'Rahul Sharma', email: 'rahul@example.com', status: 'Attending', checkInStatus: true },
    { id: 'INV-002', eventId: 'EVT-101', name: 'Sneha Patel', email: 'sneha@example.com', status: 'Pending', checkInStatus: false },
    { id: 'INV-003', eventId: 'EVT-102', name: 'Amit Kumar', email: 'amit@example.com', status: 'Attending', checkInStatus: false }
  ]);

  // Computed Values for Quick Stats
  totalEvents = computed(() => this.events().length);
  totalInvitees = computed(() => this.invitees().length);
  totalCheckIns = computed(() => this.invitees().filter(i => i.checkInStatus).length);

  // Tab Management
  setTab(tab: 'events' | 'invitees' | 'analytics') {
    this.activeTab.set(tab);
  }

  // --- Event Actions ---
  addEvent() {
    console.log('Open Add Event Modal');
    // Logic to open modal and push to this.events()
  }

  editEvent(id: string) {
    console.log('Editing Event:', id);
    // Logic to open edit modal with event data
  }

  deleteEvent(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.events.update(events => events.filter(e => e.id !== id));
    }
  }

  // --- Invitee Actions ---
  addInvitee() {
    console.log('Open Add Invitee Modal');
  }

  editInvitee(id: string) {
    console.log('Editing Invitee:', id);
  }

  deleteInvitee(id: string) {
    if (confirm('Are you sure you want to remove this invitee?')) {
      this.invitees.update(invitees => invitees.filter(i => i.id !== id));
    }
  }
}
