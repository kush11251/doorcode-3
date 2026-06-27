import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'event-timeline',
        loadComponent: () => import('./components/event-timeline/event-timeline.component').then(m => m.EventTimelineComponent)
    },
    {
        path: 'event-overview',
        loadComponent: () => import('./components/event-overview/event-overview.component').then(m => m.EventOverviewComponent)
    },
    {
        path: 'organizer-dashboard',
        loadComponent: () => import('./components/organizer-dashboard/organizer-dashboard.component').then(m => m.OrganizerDashboardComponent)
    },
    {
        path: 'admin-dashboard',
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
    },
    {
        path: 'seating-arrangement',
        loadComponent: () => import('./components/seating-arrangement/seating-arrangement.component').then(m => m.SeatingArrangementComponent)
    },
    {
        path: 'invitee-manager',
        loadComponent: () => import('./components/invitee-manager/invitee-manager.component').then(m => m.InviteeManagerComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent)
    },
    {
        path: 'privacy',
        loadComponent: () => import('./components/privacy/privacy.component').then(m => m.PrivacyComponent)
    },
    {
        path: 'terms',
        loadComponent: () => import('./components/terms/terms.component').then(m => m.TermsComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
