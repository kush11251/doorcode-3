import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemMetric, PlatformLog, DoorCodeUserDetail, LogDetail, DashboardAnalyticsData } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styles: ``
})
export class AdminDashboardComponent implements OnInit {
  // Navigation State
  currentSection = signal<'overview' | 'logs' | 'settings' | 'users'>('overview');

  // Global Platform Metrics
  metrics = signal<SystemMetric[]>([
    { label: 'Total Platform Users', value: 12840, change: '+12.3%', isPositive: true },
    { label: 'Active Live Events', value: 142, change: '+8.4%', isPositive: true },
    { label: 'API Gateway Requests/sec', value: 894, change: '-2.1%', isPositive: false },
    { label: 'System Memory Usage', value: 68, change: 'Optimal', isPositive: true }
  ]);

  // Real-time Platform Logs
  logs = signal<PlatformLog[]>([]);

  // Analytics Data
  dashboardAnalytics = signal<DashboardAnalyticsData | null>(null);
  isLoadingAnalytics = signal<boolean>(false);

  // Users Management
  users = signal<DoorCodeUserDetail[]>([]);
  selectedUser = signal<DoorCodeUserDetail | null>(null);
  showUserModal = signal<boolean>(false);

  // Log Detail
  selectedLogDetail = signal<LogDetail | null>(null);
  showLogModal = signal<boolean>(false);
  isLoadingLogDetail = signal<boolean>(false);

  // Global Flags
  isMaintenanceMode = signal<boolean>(false);
  isRegistrationOpen = signal<boolean>(true);
  isLoadingUsers = signal<boolean>(false);
  isLoadingUserDetail = signal<boolean>(false);
  isLoadingLogs = signal<boolean>(false);

  // Computeds
  errorLogCount = computed(() => this.logs().filter(l => l.level === 'ERROR').length);

  constructor(
    private api: ApiService,
    private dateFormat: DateFormatService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardAnalytics();
    this.fetchLogs();
    this.fetchUsers();
  }

  fetchDashboardAnalytics(): void {
    this.isLoadingAnalytics.set(true);
    this.api.getDashboardAnalytics().subscribe({
      next: (response) => {
        this.dashboardAnalytics.set(response.data);
        this.isLoadingAnalytics.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch dashboard analytics:', err);
        this.isLoadingAnalytics.set(false);
      }
    });
  }

  fetchLogs(): void {
    this.isLoadingLogs.set(true);
    this.api.getLogs().subscribe({
      next: (response) => {
        this.logs.set(response.data);
        this.isLoadingLogs.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch logs:', err);
        this.isLoadingLogs.set(false);
      }
    });
  }

  fetchUsers(): void {
    this.isLoadingUsers.set(true);
    this.api.getUsers().subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.isLoadingUsers.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch users:', err);
        this.isLoadingUsers.set(false);
      }
    });
  }

  showUserDetail(userId: string): void {
    this.isLoadingUserDetail.set(true);
    this.api.getUser(userId).subscribe({
      next: (response) => {
        this.selectedUser.set(response.data);
        this.showUserModal.set(true);
        this.isLoadingUserDetail.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch user detail:', err);
        this.isLoadingUserDetail.set(false);
      }
    });
  }

  closeUserModal(): void {
    this.showUserModal.set(false);
    this.selectedUser.set(null);
  }

  showLogDetail(logId: string): void {
    this.isLoadingLogDetail.set(true);
    this.api.getLogDetail(logId).subscribe({
      next: (response) => {
        this.selectedLogDetail.set(response.data);
        this.showLogModal.set(true);
        this.isLoadingLogDetail.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch log detail:', err);
        this.isLoadingLogDetail.set(false);
      }
    });
  }

  closeLogModal(): void {
    this.showLogModal.set(false);
    this.selectedLogDetail.set(null);
  }

  setSection(section: 'overview' | 'logs' | 'settings' | 'users') {
    this.currentSection.set(section);
    if (section === 'users') {
      this.fetchUsers();
    }
  }

  toggleMaintenance() {
    this.isMaintenanceMode.update(val => !val);
    console.log(`Maintenance mode set to: ${this.isMaintenanceMode()}`);
  }

  toggleRegistration() {
    this.isRegistrationOpen.update(val => !val);
    console.log(`Global registration open set to: ${this.isRegistrationOpen()}`);
  }

  clearLogs() {
    if (confirm('Are you sure you want to flush the current view logs?')) {
      this.api.deleteLogs().subscribe({
        next: () => {
          this.logs.set([]);
          console.log('Logs flushed successfully');
        },
        error: (err) => {
          console.error('Failed to flush logs:', err);
          alert('Failed to flush logs. Please try again.');
        }
      });
    }
  }

  formatTimestampIST(timestamp: string): string {
    return this.dateFormat.formatToIST(timestamp);
  }

  getRequestBody(log: LogDetail): string {
    if (typeof log.request.body === 'string') {
      return log.request.body;
    }
    return JSON.stringify(log.request.body, null, 2);
  }

  getResponseBody(log: LogDetail): string {
    if (typeof log.response.body === 'string') {
      try {
        return JSON.stringify(JSON.parse(log.response.body), null, 2);
      } catch {
        return log.response.body;
      }
    }
    return JSON.stringify(log.response.body, null, 2);
  }

  formatTimestampISTFull(timestamp: string): string {
    return this.dateFormat.formatToISTFull(timestamp);
  }

  getHeapUsagePercent(): string {
    const analytics = this.dashboardAnalytics();
    if (!analytics?.memoryUsage?.heapTotalMB || !analytics.memoryUsage.heapUsedMB) {
      return '—';
    }
    const percent = (analytics.memoryUsage.heapUsedMB / analytics.memoryUsage.heapTotalMB) * 100;
    return percent.toFixed(0);
  }
}
