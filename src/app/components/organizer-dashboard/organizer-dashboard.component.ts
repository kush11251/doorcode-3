import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Invitee, OrganizerEvent, OrganizerDashboardData, CreateEventPayload, UpdateEventPayload, EventActivityPayload, OrganizerInviteePatchPayload } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organizer-dashboard.component.html',
  styles: ``
})
export class OrganizerDashboardComponent implements OnInit {
  // Navigation State
  activeTab = signal<'events' | 'invitees' | 'analytics'>('events');

  // Data Signals
  events = signal<OrganizerEvent[]>([]);
  analytics = signal<OrganizerDashboardData>({
    userId: '',
    organizerName: '',
    totalEvents: 0,
    totalInvitees: 0
  });

  invitees = signal<Invitee[]>([]);

  showCreateEventModal = signal<boolean>(false);
  showEditEventModal = signal<boolean>(false);
  isCreatingEvent = signal<boolean>(false);
  isUpdatingEvent = signal<boolean>(false);
  editingEventId: string | null = null;
  createEventPayload: CreateEventPayload = {
    title: '',
    eventCode: '',
    organizer: '',
    organizerIds: [],
    inviteeIds: [],
    date: '',
    time: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    address: '',
    dressCode: '',
    description: '',
    activities: [
      { time: '', name: '', description: '' }
    ]
  };

  editEventPayload: UpdateEventPayload = {
    title: '',
    location: '',
    date: '',
    time: '',
    startDateTime: '',
    endDateTime: '',
    address: '',
    dressCode: '',
    description: '',
    activities: [{ time: '', name: '', description: '' }]
  };

  // Computed Values for Quick Stats
  totalEvents = computed(() => this.analytics().totalEvents);
  totalInvitees = computed(() => this.analytics().totalInvitees);
  organizerName = computed(() => this.analytics().organizerName || 'Organizer Analytics');

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  // Tab Management
  setTab(tab: 'events' | 'invitees' | 'analytics') {
    this.activeTab.set(tab);
  }

  // --- Event Actions ---
  openCreateEventModal() {
    this.showCreateEventModal.set(true);
  }

  closeCreateEventModal() {
    this.showCreateEventModal.set(false);
    this.resetCreateEventPayload();
  }

  addEvent() {
    this.openCreateEventModal();
  }

  addActivityRow() {
    const activities = this.showEditEventModal() ? this.editEventPayload.activities : this.createEventPayload.activities;
    activities.push({ time: '', name: '', description: '' });
  }

  removeActivityRow(index: number) {
    const activities = this.showEditEventModal() ? this.editEventPayload.activities : this.createEventPayload.activities;
    activities.splice(index, 1);
    if (activities.length === 0) {
      activities.push({ time: '', name: '', description: '' });
    }
  }

  resetCreateEventPayload() {
    this.createEventPayload = {
      title: '',
      eventCode: '',
      organizer: '',
      organizerIds: [],
      inviteeIds: [],
      date: '',
      time: '',
      startDateTime: '',
      endDateTime: '',
      location: '',
      address: '',
      dressCode: '',
      description: '',
      activities: [{ time: '', name: '', description: '' }]
    };
  }

  createEvent() {
    this.isCreatingEvent.set(true);
    this.api.createEvent(this.createEventPayload).subscribe({
      next: (response) => {
        const created = response.data;
        this.events.update(events => [
          ...events,
          {
            id: created.eventId || created._id,
            eventCode: created.eventCode,
            name: created.title,
            date: created.date,
            location: created.location,
            status: 'Published',
            attendeeCount: 0
          }
        ]);
        this.isCreatingEvent.set(false);
        this.closeCreateEventModal();
        console.log(response.message);
      },
      error: (err) => {
        console.error('Failed to create event:', err);
        this.isCreatingEvent.set(false);
      }
    });
  }

  editEvent(id: string) {
    this.openEditEventModal(id);
  }

  openEditEventModal(eventId: string) {
    this.editingEventId = eventId;
    this.showEditEventModal.set(true);
    this.api.getEventById(eventId).subscribe({
      next: (response) => {
        const event = response.data;
        this.editEventPayload = {
          title: event.title,
          location: event.location,
          date: event.date,
          time: event.time,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          address: event.address,
          dressCode: event.dressCode,
          description: event.description,
          activities: event.activities.map((activity) => ({
            time: activity.time,
            name: activity.name,
            description: activity.description
          }))
        };
      },
      error: (err) => {
        console.error('Failed to load event for editing:', err);
        this.showEditEventModal.set(false);
      }
    });
  }

  closeEditEventModal() {
    this.showEditEventModal.set(false);
    this.editingEventId = null;
    this.resetEditEventPayload();
  }

  resetEditEventPayload() {
    this.editEventPayload = {
      title: '',
      location: '',
      date: '',
      time: '',
      startDateTime: '',
      endDateTime: '',
      address: '',
      dressCode: '',
      description: '',
      activities: [{ time: '', name: '', description: '' }]
    };
  }

  updateEvent() {
    if (!this.editingEventId) {
      return;
    }

    this.isUpdatingEvent.set(true);
    this.api.updateEvent(this.editingEventId, this.editEventPayload).subscribe({
      next: (response) => {
        const updated = response.data;
        this.events.update(events => events.map(e => e.id === this.editingEventId ? {
          ...e,
          name: updated.title,
          date: updated.date,
          location: updated.location
        } : e));
        this.isUpdatingEvent.set(false);
        this.closeEditEventModal();
      },
      error: (err) => {
        console.error('Failed to update event:', err);
        this.isUpdatingEvent.set(false);
        alert('Unable to update event at this time. Please try again later.');
      }
    });
  }

  deleteEvent(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.api.deleteEvent(id).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        console.error('Failed to delete event:', err);
        alert('Unable to delete event at this time. Please try again later.');
      }
    });
  }

  viewEvent(eventId: string) {
    this.router.navigate(['/event-overview'], { queryParams: { eventId } });
  }

  viewInvitees(eventId: string) {
    this.router.navigate(['/invitee-manager'], { queryParams: { eventId } });
  }

  // --- Invitee Actions ---
  addInvitee() {
    console.log('Open Add Invitee Modal');
  }

  editInvitee(id: string) {
    console.log('Editing Invitee:', id);
  }

  deleteInvitee(id: string) {
    if (!confirm('Are you sure you want to remove this invitee?')) {
      return;
    }

    const organizerId = this.auth.getUser()?.id;
    if (!organizerId) {
      console.error('Unable to delete invitee: user is not authenticated.');
      return;
    }

    const payload: OrganizerInviteePatchPayload = {
      action: 'remove',
      inviteeId: id
    };

    this.api.updateOrganizerInvitees(organizerId, payload).subscribe({
      next: () => {
        this.loadOrganizerInvitees();
      },
      error: (err) => {
        console.error('Failed to remove invitee:', err);
        alert('Unable to remove invitee at this time. Please try again later.');
      }
    });
  }

  ngOnInit() {
    this.loadOrganizerEvents();
    this.loadOrganizerAnalytics();
    this.loadOrganizerInvitees();
  }

  private loadOrganizerInvitees() {
    const organizerId = this.auth.getUser()?.id;
    if (!organizerId) {
      console.error('Unable to load organizer invitees: user is not authenticated.');
      return;
    }

    this.api.getOrganizerInvitees(organizerId).subscribe({
      next: (response) => {
        const mappedInvitees = response.data.map(invitee => {
          const status = invitee.role === 'organizer' ? 'Attending' : 'Pending';
          return {
            id: invitee.userId,
            eventId: invitee.eventCode,
            name: invitee.fullName,
            email: invitee.email,
            status: status as 'Attending' | 'Pending',
            checkInStatus: false
          };
        });
        this.invitees.set(mappedInvitees);
      },
      error: (err) => {
        console.error('Failed to load organizer invitees:', err);
      }
    });
  }

  private loadOrganizerAnalytics() {
    const userId = this.auth.getUser()?.id;
    if (!userId) {
      console.error('Unable to load organizer analytics: user is not authenticated.');
      return;
    }

    this.api.getOrganizerDashboard(userId).subscribe({
      next: (response) => {
        this.analytics.set(response.data);
      },
      error: (err) => {
        console.error('Failed to load organizer analytics:', err);
      }
    });
  }

  private loadOrganizerEvents() {
    const userId = this.auth.getUser()?.id;
    if (!userId) {
      console.error('Unable to load organizer events: user is not authenticated.');
      return;
    }

    this.api.getEventsByUser(userId).subscribe({
      next: (response) => {
        const mappedEvents = response.data.map((event) => ({
          id: event.eventId || event._id,
          eventCode: event.eventCode,
          name: event.title,
          date: event.date,
          location: event.location,
          status: 'Published' as const,
          attendeeCount: event.inviteeIds?.length ?? 0
        }));
        this.events.set(mappedEvents);
      },
      error: (err) => {
        console.error('Failed to load organizer events:', err);
      }
    });
  }
}
