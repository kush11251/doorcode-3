import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginPayload, SignupPayload, PlatformLog, DoorCodeUserDetail } from '../models/interfaces';
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
}
