import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginPayload, SignupPayload, PlatformLog, DoorCodeUserDetail, LogDetail, UserProfileUpdatePayload, PasswordUpdatePayload, UpdateProfileResponse, UpdatePasswordResponse, DashboardAnalyticsResponse, OrganizerDashboardResponse, EventDetailsResponse, OrganizerInviteesResponse, OrganizerInviteePatchPayload, AddEventOrganizerPayload, AddEventInviteePayload, CreateEventPayload, CreateEventResponse, UpdateEventPayload, UpdateEventResponse } from '../models/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): { [key: string]: string } {
    const token = this.auth.getSession()?.token;
    const headers: { [key: string]: string } = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/signup`, payload);
  }

  getLogs(): Observable<{ count: number; data: PlatformLog[] }> {
    return this.http.get<{ count: number; data: PlatformLog[] }>(`${this.baseUrl}/logs`, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteLogs(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/logs`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getUsers(): Observable<{ count: number; data: DoorCodeUserDetail[] }> {
    return this.http.get<{ count: number; data: DoorCodeUserDetail[] }>(`${this.baseUrl}/users`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getUser(userId: string): Observable<{ data: DoorCodeUserDetail }> {
    return this.http.get<{ data: DoorCodeUserDetail }>(`${this.baseUrl}/users/${userId}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateUser(userId: string, payload: UserProfileUpdatePayload): Observable<UpdateProfileResponse> {
    return this.http.patch<UpdateProfileResponse>(`${this.baseUrl}/users/${userId}`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  updatePassword(userId: string, payload: PasswordUpdatePayload): Observable<UpdatePasswordResponse> {
    return this.http.post<UpdatePasswordResponse>(`${this.baseUrl}/users/${userId}/password`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  getDashboardAnalytics(): Observable<DashboardAnalyticsResponse> {
    return this.http.get<DashboardAnalyticsResponse>(`${this.baseUrl}/dashboard`, {
      headers: this.getAuthHeaders()
    });
  }

  getOrganizerDashboard(organizerId: string): Observable<OrganizerDashboardResponse> {
    return this.http.get<OrganizerDashboardResponse>(`${this.baseUrl}/dashboard/organizer/${organizerId}`, {
      headers: this.getAuthHeaders()
    });
  }

  createEvent(payload: CreateEventPayload): Observable<CreateEventResponse> {
    console.log('Creating event with payload:', payload);
    return this.http.post<CreateEventResponse>(`${this.baseUrl}/events`, payload, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
  }

  updateEvent(eventId: string, payload: UpdateEventPayload): Observable<UpdateEventResponse> {
    return this.http.patch<UpdateEventResponse>(`${this.baseUrl}/events/${eventId}`, payload, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
  }

  getEventsByUser(userId: string): Observable<{ statusCode: number; count: number; data: any[] }> {
    return this.http.get<{ statusCode: number; count: number; data: any[] }>(`${this.baseUrl}/events/user/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getOrganizerInvitees(organizerId: string): Observable<OrganizerInviteesResponse> {
    return this.http.get<OrganizerInviteesResponse>(`${this.baseUrl}/events/organizer/${organizerId}/invitees`, {
      headers: this.getAuthHeaders()
    });
  }

  getEventInviteeDetails(eventId: string): Observable<OrganizerInviteesResponse> {
    return this.http.get<OrganizerInviteesResponse>(`${this.baseUrl}/events/${eventId}/invitees/details`, {
      headers: this.getAuthHeaders()
    });
  }

  addEventOrganizer(eventId: string, payload: AddEventOrganizerPayload): Observable<OrganizerInviteesResponse> {
    return this.http.post<OrganizerInviteesResponse>(`${this.baseUrl}/events/${eventId}/organizers`, payload, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
  }

  addEventInvitee(eventId: string, payload: AddEventInviteePayload): Observable<OrganizerInviteesResponse> {
    return this.http.post<OrganizerInviteesResponse>(`${this.baseUrl}/events/${eventId}/invitees`, payload, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
  }

  patchEventInviteeDetails(eventId: string, payload: OrganizerInviteePatchPayload): Observable<OrganizerInviteesResponse> {
    return this.http.patch<OrganizerInviteesResponse>(`${this.baseUrl}/events/${eventId}/invitees/details`, payload, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
  }

  updateOrganizerInvitees(organizerId: string, payload: OrganizerInviteePatchPayload): Observable<OrganizerInviteesResponse> {
    return this.http.patch<OrganizerInviteesResponse>(`${this.baseUrl}/events/organizer/${organizerId}/invitees`, payload, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
  }

  getEventById(eventId: string): Observable<EventDetailsResponse> {
    return this.http.get<EventDetailsResponse>(`${this.baseUrl}/events/${eventId}`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteEvent(eventId: string): Observable<{ statusCode: number; message: string }> {
    return this.http.delete<{ statusCode: number; message: string }>(`${this.baseUrl}/events/${eventId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getLogDetail(logId: string): Observable<{ data: LogDetail }> {
    return this.http.get<{ data: LogDetail }>(`${this.baseUrl}/logs/${logId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
