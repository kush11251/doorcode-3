import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { OrganizerInvitee, OrganizerInviteePatchPayload } from '../../models/interfaces';

@Component({
  selector: 'app-invitee-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invitee-manager.component.html',
  styles: ``
})
export class InviteeManagerComponent implements OnInit {
  eventId = signal<string>('');
  invitees = signal<OrganizerInvitee[]>([]);

  isModalOpen = signal<boolean>(false);
  modalRoleType = signal<'user' | 'organizer'>('user');
  newEmailInput = signal<string>('');
  isSubmitting = signal<boolean>(false);
  loading = signal<boolean>(false);

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const eventId = params['eventId'] as string | undefined;
      if (eventId) {
        this.eventId.set(eventId);
        this.loadEventInvitees(eventId);
      } else {
        this.invitees.set([]);
      }
    });
  }

  loadEventInvitees(eventId: string) {
    this.loading.set(true);
    this.api.getEventInviteeDetails(eventId).subscribe({
      next: (response) => {
        this.invitees.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load event invitees:', err);
        this.loading.set(false);
      }
    });
  }

  openAddModal(role: 'user' | 'organizer') {
    this.modalRoleType.set(role);
    this.newEmailInput.set('');
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.newEmailInput.set('');
  }

  submitNewUser() {
    const eventId = this.eventId();
    const email = this.newEmailInput().trim();
    if (!eventId || !email) return;

    this.isSubmitting.set(true);

    if (this.modalRoleType() === 'organizer') {
      this.api.addEventOrganizer(eventId, { organizerEmail: email }).subscribe({
        next: () => {
          this.loadEventInvitees(eventId);
          this.isSubmitting.set(false);
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to add organizer:', err);
          this.isSubmitting.set(false);
          alert('Unable to add organizer at this time. Please try again later.');
        }
      });
      return;
    }

    this.api.addEventInvitee(eventId, { inviteeEmail: email }).subscribe({
      next: () => {
        this.loadEventInvitees(eventId);
        this.isSubmitting.set(false);
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to add invitee:', err);
        this.isSubmitting.set(false);
        alert('Unable to add invitee at this time. Please try again later.');
      }
    });
  }

  removeUser(id: string) {
    const eventId = this.eventId();
    if (!eventId) {
      return;
    }

    if (!confirm('Are you sure you want to remove this user from the event?')) {
      return;
    }

    const payload: OrganizerInviteePatchPayload = {
      action: 'remove',
      inviteeId: id
    };

    this.api.patchEventInviteeDetails(eventId, payload).subscribe({
      next: () => {
        this.loadEventInvitees(eventId);
      },
      error: (err) => {
        console.error('Failed to remove invitee:', err);
        alert('Unable to remove invitee at this time. Please try again later.');
      }
    });
  }
}
