import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  showSuccess(message: string, title = 'Success'): void {
    this.addToast({ message, title, type: 'success' });
  }

  showError(message: string, title = 'Error'): void {
    this.addToast({ message, title, type: 'error' });
  }

  showInfo(message: string, title = 'Info'): void {
    this.addToast({ message, title, type: 'info' });
  }

  dismissToast(id: string): void {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }

  private addToast(payload: Omit<ToastMessage, 'id' | 'createdAt'>): void {
    const toast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      ...payload
    };

    this.toasts.update((list) => [toast, ...list]);

    setTimeout(() => this.dismissToast(toast.id), 4000);
  }
}
