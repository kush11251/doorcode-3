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

export interface PlatformLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  service: string;
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