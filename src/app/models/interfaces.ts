export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: 'admin' | 'organizer' | 'user';
  phoneNumber?: string | null;
}

export interface AuthResponse {
  message: string;
  user: {
    userId: string;
    firstName: string;
    lastName?: string;
    email: string;
    role: 'admin' | 'organizer' | 'user';
    phoneNumber?: string | null;
  };
  token: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface DoorCodeUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  id?: string;
}

export interface OrganizerEvent {
  id: string;
  eventCode: string;
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

export interface OrganizerInvitee {
  eventCode: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'organizer' | 'user' | 'admin';
}

export interface OrganizerInviteePatchPayload {
  action: 'add' | 'remove' | 'update';
  inviteeId: string;
  eventCode?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: 'organizer' | 'user' | 'admin';
}

export interface AddEventOrganizerPayload {
  organizerEmail: string;
}

export interface AddEventInviteePayload {
  inviteeEmail: string;
}

export interface OrganizerInviteesResponse {
  statusCode: number;
  count: number;
  data: OrganizerInvitee[];
}

export interface GlobalSettingsPayload {
  maintenanceMode: boolean;
  signupEnabled: boolean;
}

export interface GlobalSettingsResponse {
  statusCode: number;
  data: {
    metadata: {
      updatedBy: string;
    };
    _id: string;
    maintenanceMode: boolean;
    signupEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface TimelineEvent {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  type: 'session' | 'break' | 'keynote';
  speaker?: string;
  location?: string;
}

export interface DashboardEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
  guests: number;
}

export interface Activity {
  time: string;
  name: string;
  description: string;
}

export interface EventActivityPayload {
  time: string;
  name: string;
  description: string;
}

export interface CreateEventPayload {
  title: string;
  eventCode: string;
  organizer: string;
  organizerIds: string[];
  inviteeIds: string[];
  date: string;
  time: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  address: string;
  dressCode: string;
  description: string;
  activities: EventActivityPayload[];
}

export interface UpdateEventPayload {
  title: string;
  location: string;
  date: string;
  time: string;
  startDateTime: string;
  endDateTime: string;
  address: string;
  dressCode: string;
  description: string;
  activities: EventActivityPayload[];
}

export interface UpdateEventResponse {
  statusCode: number;
  message: string;
  data: {
    metadata: Record<string, unknown>;
    _id: string;
    title: string;
    eventCode: string;
    organizer: string;
    organizerIds: string[];
    inviteeIds: string[];
    date: string;
    time: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
    address: string;
    dressCode: string;
    description: string;
    activities: Array<EventActivityPayload & { _id: string; id: string }>;
    eventId: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  };
}

export interface CreateEventResponse {
  statusCode: number;
  message: string;
  data: {
    title: string;
    eventCode: string;
    organizer: string;
    organizerIds: string[];
    inviteeIds: string[];
    date: string;
    time: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
    address: string;
    dressCode: string;
    description: string;
    activities: Array<EventActivityPayload & { _id: string; id: string }>;
    metadata: Record<string, unknown>;
    _id: string;
    eventId: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  };
}

export interface OrganizerDashboardData {
  userId: string;
  organizerName: string;
  totalEvents: number;
  totalInvitees: number;
}

export interface OrganizerDashboardResponse {
  statusCode: number;
  data: OrganizerDashboardData;
}

export interface OrganizerEventItem {
  _id: string;
  title: string;
  eventCode: string;
  organizer: string;
  organizerIds: string[];
  inviteeIds: string[];
  date: string;
  time: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  address: string;
  dressCode: string;
  description: string;
  activities: Array<EventActivityPayload & { _id: string; id: string }>;
  metadata?: {
    createdBy: string;
    updatedBy: string;
  };
  eventId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OrganizerEventsResponse {
  statusCode: number;
  count: number;
  data: OrganizerEventItem[];
}

export interface EventDetails {
  title: string;
  organizer: string;
  date: string;
  time: string;
  startDateTime: string;
  location: string;
  address: string;
  dressCode: string;
  description: string;
  activities: Activity[];
}

export interface EventDetailsResponse {
  statusCode: number;
  data: {
    metadata: {
      createdBy: string;
      updatedBy: string;
    };
    _id: string;
    title: string;
    eventCode: string;
    organizer: string;
    organizerIds: string[];
    inviteeIds: string[];
    date: string;
    time: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
    address: string;
    dressCode: string;
    description: string;
    activities: Array<EventActivityPayload & { _id: string; id: string }>;
    organizerDetails: Array<Record<string, unknown>>;
    inviteeDetails: Array<Record<string, unknown>>;
    eventId: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  };
}

export interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
}

export interface Seat {
  id: string;
  tableId: string;
  number: number;
  assigneeName: string | null;
  role: 'Guest' | 'Speaker' | 'VIP' | 'Empty';
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  seats: Seat[];
}

export interface SystemMetric {
  label: string;
  value: number;
  change: string;
  isPositive: boolean;
}

export interface DashboardSegmentSummary {
  total: number;
  todayCount: number;
  prevCount: number;
  change: number;
  percent: number;
}

export interface MemoryUsageMetrics {
  rssMB: number;
  heapTotalMB: number;
  heapUsedMB: number;
  externalMB: number;
  arrayBuffersMB: number;
}

export interface DashboardAnalyticsData {
  users: DashboardSegmentSummary;
  events: DashboardSegmentSummary;
  requests: DashboardSegmentSummary;
  memoryUsage: MemoryUsageMetrics;
}

export interface DashboardAnalyticsResponse {
  statusCode: number;
  data: DashboardAnalyticsData;
}

export interface PlatformLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  service: string;
}

export interface LogRequestHeaders {
  origin: string;
  referer: string;
  userAgent: string;
  contentType: string;
  [key: string]: unknown;
}

export interface LogRequestPayload {
  method: string;
  url: string;
  headers: LogRequestHeaders;
  body: Record<string, unknown> | string | null;
}

export interface LogResponsePayload {
  statusCode: number;
  statusMessage: string;
  responseTimeMs: number;
  body: string | Record<string, unknown> | null;
}

export interface LogMetadata {
  protocol: string;
  hostname: string;
  secure: boolean;
  forwarded: string;
}

export interface LogDetail {
  _id: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  service: string;
  origin: string;
  ipAddress: string;
  request: LogRequestPayload;
  response: LogResponsePayload;
  metadata: LogMetadata;
  id: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface DoorCodeUserDetail {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'organizer' | 'user';
  events: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface UserProfileUpdatePayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface PasswordUpdatePayload {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileResponse {
  statusCode: number;
  message: string;
  data: DoorCodeUserDetail;
}

export interface UpdatePasswordResponse {
  statusCode: number;
  message: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  role: 'Organizer' | 'Attendee' | 'Hybrid';
  joinDate: string;
}

export interface UserEvent {
  id: string;
  name: string;
  date: string;
  role: 'Organizing' | 'Attending';
  status: 'Upcoming' | 'Completed';
  location: string;
}

export interface DoorCodeUser {
  userId: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  role?: string;
}