import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {
  /**
   * Converts UTC timestamp to IST (Indian Standard Time) formatted string
   * Example: "04:25:12" for UTC time
   */
  formatToIST(isoString: string): string {
    try {
      const date = new Date(isoString);
      const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      return istDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      return isoString;
    }
  }

  /**
   * Converts UTC timestamp to IST formatted full date and time
   * Example: "27 Jun 2026, 04:25:12"
   */
  formatToISTFull(isoString: string): string {
    try {
      const date = new Date(isoString);
      const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      return istDate.toLocaleString('en-US', { 
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      return isoString;
    }
  }
}
