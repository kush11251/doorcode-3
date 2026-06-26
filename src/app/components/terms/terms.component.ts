import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms.component.html',
  styles: ``
})
export class TermsComponent {
  lastUpdated = 'June 27, 2026';
}
