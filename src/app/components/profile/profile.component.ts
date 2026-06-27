import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserEvent, UserProfile, DoorCodeUserDetail, UserProfileUpdatePayload, PasswordUpdatePayload, UpdateProfileResponse } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit {
  profile = signal<UserProfile>({
    firstName: 'Loading',
    lastName: 'Profile',
    email: 'loading@doorcode.com',
    phone: '',
    avatarUrl: null,
    role: 'Hybrid',
    joinDate: 'Loading'
  });

  isLoadingProfile = signal<boolean>(true);

  // Mock Event History
  events = signal<UserEvent[]>([
    // {
    //   id: 'EVT-01',
    //   name: 'Kedarnath High-Altitude Trek',
    //   date: 'April 28, 2026',
    //   role: 'Organizing',
    //   status: 'Upcoming',
    //   location: 'Kedarnath Basecamp'
    // },
    // {
    //   id: 'EVT-02',
    //   name: 'Jiffly Platform Launch Party',
    //   date: 'February 15, 2026',
    //   role: 'Organizing',
    //   status: 'Completed',
    //   location: 'Pune Tech Hub'
    // },
    // {
    //   id: 'EVT-03',
    //   name: 'Thailand Developer Retreat',
    //   date: 'December 18, 2024',
    //   role: 'Attending',
    //   status: 'Completed',
    //   location: 'Phuket & Krabi'
    // }
  ]);

  upcomingEvents = computed(() => this.events().filter(e => e.status === 'Upcoming'));
  pastEvents = computed(() => this.events().filter(e => e.status === 'Completed'));

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  getInitials(): string {
    const fName = this.profile().firstName;
    const lName = this.profile().lastName;
    return `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase();
  }

  editProfile() {
    this.toggleEditProfile();
  }

  passwordUpdate = signal<PasswordUpdatePayload>({
    oldPassword: '',
    newPassword: ''
  });

  isEditingProfile = signal<boolean>(false);
  isUpdatingProfile = signal<boolean>(false);
  isUpdatingPassword = signal<boolean>(false);
  profileForm = signal<UserProfileUpdatePayload>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  logout(): void {
    this.auth.clearSession();
    this.router.navigate(['/login']);
  }

  private loadProfile(): void {
    const userId = this.auth.getUser()?.id;
    if (!userId) {
      this.logout();
      return;
    }

    this.isLoadingProfile.set(true);
    this.api.getUser(userId).subscribe({
      next: (response) => {
        this.profile.set(this.mapUserDetailToProfile(response.data));
        this.profileForm.set(this.mapUserDetailToForm(response.data));
        this.isLoadingProfile.set(false);
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.isLoadingProfile.set(false);
      }
    });
  }

  private mapUserDetailToProfile(user: DoorCodeUserDetail): UserProfile {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phoneNumber || '',
      avatarUrl: null,
      role: user.role === 'admin' ? 'Hybrid' : user.role === 'organizer' ? 'Organizer' : 'Attendee',
      joinDate: new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    };
  }

  private mapUserDetailToForm(user: DoorCodeUserDetail): UserProfileUpdatePayload {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || ''
    };
  }

  toggleEditProfile(): void {
    this.isEditingProfile.update(value => !value);
  }

  updateProfileField(field: keyof UserProfileUpdatePayload, value: string): void {
    this.profileForm.update(form => ({ ...form, [field]: value }));
  }

  updatePasswordField(field: keyof PasswordUpdatePayload, value: string): void {
    this.passwordUpdate.update(form => ({ ...form, [field]: value }));
  }

  submitProfileUpdate(): void {
    const userId = this.auth.getUser()?.id;
    if (!userId) {
      this.logout();
      return;
    }

    const payload = this.profileForm();
    this.isUpdatingProfile.set(true);
    this.api.updateUser(userId, payload).subscribe({
      next: () => {
        this.profile.set({
          ...this.profile(),
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: payload.phoneNumber
        });
        this.isUpdatingProfile.set(false);
        this.isEditingProfile.set(false);
      },
      error: (err) => {
        console.error('Profile update failed:', err);
        this.isUpdatingProfile.set(false);
      }
    });
  }

  submitPasswordUpdate(): void {
    const userId = this.auth.getUser()?.id;
    if (!userId) {
      this.logout();
      return;
    }

    const payload = this.passwordUpdate();
    this.isUpdatingPassword.set(true);
    this.api.updatePassword(userId, payload).subscribe({
      next: () => {
        this.passwordUpdate.set({ oldPassword: '', newPassword: '' });
        this.isUpdatingPassword.set(false);
      },
      error: (err) => {
        console.error('Password update failed:', err);
        this.isUpdatingPassword.set(false);
      }
    });
  }
}
