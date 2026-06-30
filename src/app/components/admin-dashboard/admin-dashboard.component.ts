import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
export class AdminDashboardComponent implements OnInit, OnDestroy {
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
  logsPerPage = 50;
  currentLogPage = signal<number>(1);

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

  logSections = computed(() => {
    const batchSize = this.logsPerPage;
    const allLogs = this.logs();
    const sections: { title: string; logs: PlatformLog[] }[] = [];

    for (let i = 0; i < allLogs.length; i += batchSize) {
      const start = i + 1;
      const end = Math.min(i + batchSize, allLogs.length);
      sections.push({
        title: `Logs ${start} - ${end}`,
        logs: allLogs.slice(i, end)
      });
    }

    return sections;
  });

  logPages = computed(() => this.logSections().map((_, index) => index + 1));

  currentLogSection = computed(() => {
    const sections = this.logSections();
    const pageIndex = Math.min(Math.max(this.currentLogPage() - 1, 0), sections.length - 1);
    return sections[pageIndex] ?? null;
  });

  constructor(
    private api: ApiService,
    private dateFormat: DateFormatService,
    private router: Router
  ) {}

  setLogPage(page: number): void {
    const pageCount = this.logPages().length;
    if (page < 1 || page > pageCount) {
      return;
    }
    this.currentLogPage.set(page);
  }

  ngOnInit(): void {
    this.fetchDashboardAnalytics();
    this.fetchLogs();
    this.fetchUsers();

    this.logRefreshIntervalId = window.setInterval(() => {
      if (this.currentSection() === 'logs') {
        this.fetchLogs();
      }
    }, 30000);
  }

  redirectToUserDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  redirectToOrganizerDashboard(): void {
    this.router.navigate(['/organizer-dashboard']);
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
        this.currentLogPage.set(1);
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
    const newValue = !this.isMaintenanceMode();
    this.isMaintenanceMode.set(newValue);
    this.api.updateGlobalSettings({
      maintenanceMode: newValue,
      signupEnabled: this.isRegistrationOpen()
    }).subscribe({
      next: (response) => {
        this.isMaintenanceMode.set(response.data.maintenanceMode);
        this.isRegistrationOpen.set(response.data.signupEnabled);
      },
      error: (err) => {
        console.error('Failed to update global maintenance mode:', err);
        this.isMaintenanceMode.update(val => !val);
        alert('Unable to change maintenance mode. Please try again.');
      }
    });
  }

  toggleRegistration() {
    const newValue = !this.isRegistrationOpen();
    this.isRegistrationOpen.set(newValue);
    this.api.updateGlobalSettings({
      maintenanceMode: this.isMaintenanceMode(),
      signupEnabled: newValue
    }).subscribe({
      next: (response) => {
        this.isMaintenanceMode.set(response.data.maintenanceMode);
        this.isRegistrationOpen.set(response.data.signupEnabled);
      },
      error: (err) => {
        console.error('Failed to update signup enabled state:', err);
        this.isRegistrationOpen.update(val => !val);
        alert('Unable to change registration state. Please try again.');
      }
    });
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
    if (typeof log?.request?.body === 'string') {
      return log?.request?.body;
    }
    return JSON.stringify(log?.request?.body, null, 2);
  }

  getResponseBody(log: LogDetail): string {
    if (typeof log?.response?.body === 'string') {
      try {
        return JSON.stringify(JSON.parse(log?.response?.body), null, 2);
      } catch {
        return log?.response?.body;
      }
    }
    return JSON.stringify(log?.response?.body, null, 2);
  }

  formatTimestampISTFull(timestamp: string): string {
    return this.dateFormat.formatToISTFull(timestamp);
  }

  logRefreshIntervalId: number | null = null;

  getHeapUsagePercent(): string {
    const analytics = this.dashboardAnalytics();
    if (!analytics?.memoryUsage?.heapTotalMB || !analytics.memoryUsage.heapUsedMB) {
      return '—';
    }
    const percent = (analytics.memoryUsage.heapUsedMB / analytics.memoryUsage.heapTotalMB) * 100;
    return percent.toFixed(0);
  }

  ngOnDestroy(): void {
    if (this.logRefreshIntervalId !== null) {
      clearInterval(this.logRefreshIntervalId);
      this.logRefreshIntervalId = null;
    }
  }
}
