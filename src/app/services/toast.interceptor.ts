import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from './toast.service';

@Injectable()
export class ToastInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const body = event.body as any;
          const statusCode = body?.statusCode ?? event.status;
          const message = body?.message || body?.data?.message || event.statusText || '';

          if (statusCode >= 200 && statusCode < 300) {
            this.toastService.showSuccess(message || 'Operation completed successfully');
          } else if (statusCode >= 400) {
            this.toastService.showError(message || 'Request failed.');
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || error.message || 'Server request failed';
        this.toastService.showError(message);
        return throwError(() => error);
      })
    );
  }
}
