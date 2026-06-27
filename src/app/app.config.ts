import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { LucideAngularModule, icons } from 'lucide-angular';
import { ToastInterceptor } from './services/toast.interceptor';

import { routes } from './app.routes';

import * as AOS from 'aos';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })),
    importProvidersFrom(HttpClientModule, LucideAngularModule.pick(icons)),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ToastInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return () => {
          AOS.init();
        };
      },
      multi: true
    }
  ]
};
