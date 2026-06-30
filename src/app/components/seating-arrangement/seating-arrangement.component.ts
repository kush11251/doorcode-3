import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Seat, Table, SeatingTableData, SeatingResponse, UserSummaryRecord, UserSummaryResponse, SeatingUpdatePayload } from '../../models/interfaces';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-seating-arrangement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seating-arrangement.component.html',
  styles: ``
})
export class SeatingArrangementComponent implements OnInit {
  eventId = '';

  tables = signal<Table[]>([]);
  seatingId = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  userSummary = signal<UserSummaryRecord[]>([]);
  selectedUserId = signal<string>('');
  selectedGuestType = signal<'vip' | 'guest' | 'speaker' | 'none'>('guest');
  updateTableNumber = signal<string>('1');
  isUpdatingTable = signal<boolean>(false);
  isEditModalOpen = signal<boolean>(false);

  selectedSeat = signal<Seat | null>(null);
  hasSelection = computed(() => this.selectedSeat() !== null);
  canEdit = computed(() => {
    const role = this.auth.getUser()?.role;
    return role === 'admin' || role === 'organizer';
  });

  constructor(private api: ApiService, private auth: AuthService, private route: ActivatedRoute) {}

  private loadSeating(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.api.getSeatingForEvent(this.eventId).subscribe({
      next: (response: SeatingResponse) => {
        this.seatingId.set(response.data.seatingId);
        this.tables.set(this.mapSeatingTables(response.data.tables));
        this.isLoading.set(false);
        this.successMessage.set('');
      },
      error: (err) => {
        console.error('Failed to load seating layout:', err);
        this.errorMessage.set('Unable to load seating layout. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  private mapSeatingTables(tables: SeatingTableData[]): Table[] {
    return tables.map((table) => {
      const tableId = `T${table.tableNumber}`;
      const seats: Seat[] = Array.from({ length: table.numberOfPeople }, (_, index) => {
        const seatNumber = (index + 1).toString();
        const person = table.people.find((person) => person.seat === seatNumber);
        const role = person ? person.role.toUpperCase() : 'Empty';
        const assigneeName = person && person.firstName ? `${person.firstName} ${person.lastName ?? ''}`.trim() : null;

        return {
          id: `${tableId}-S${index + 1}`,
          tableId,
          number: index + 1,
          userId: person?.userId || null,
          assigneeName: assigneeName || null,
          role: role === 'VIP' ? 'VIP' : role === 'GUEST' ? 'Guest' : role === 'SPEAKER' ? 'Speaker' : 'Empty'
        };
      });

      return {
        id: tableId,
        name: `Table ${table.tableNumber}`,
        capacity: table.numberOfPeople,
        seats
      };
    });
  }

  getTopRowSeats(table: Table): Seat[] {
    return table.seats.slice(0, Math.ceil(table.capacity / 2));
  }

  getBottomRowSeats(table: Table): Seat[] {
    return table.seats.slice(Math.ceil(table.capacity / 2));
  }

  loadUserSummary(): void {
    if (!this.canEdit()) {
      return;
    }

    this.api.getUserSummary().subscribe({
      next: (response: UserSummaryResponse) => {
        this.userSummary.set(response.data);
      },
      error: (err) => {
        console.error('Failed to load user summary:', err);
      }
    });
  }

  private ensureUserSummaryLoaded(): void {
    if (this.canEdit() && this.userSummary().length === 0) {
      this.loadUserSummary();
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const routeEventId = params['eventId'] as string | null;
      if (routeEventId) {
        this.eventId = routeEventId;
      }
      if (this.canEdit()) {
        this.loadUserSummary();
      }
      this.loadSeating();
    });
  }

  onTableNumberChange(event: Event): void {
    this.updateTableNumber.set((event.target as HTMLSelectElement).value);
  }

  onUserSelectionChange(event: Event): void {
    this.selectedUserId.set((event.target as HTMLSelectElement).value);
  }

  onGuestTypeChange(event: Event): void {
    this.selectedGuestType.set((event.target as HTMLSelectElement).value as 'vip' | 'guest' | 'speaker' | 'none');
  }

  openEditModalForTable(tableId: string): void {
    if (!this.canEdit()) {
      return;
    }

    this.ensureUserSummaryLoaded();
    this.updateTableNumber.set(tableId);
    const table = this.tables().find((table) => table.id === `T${tableId}`);
    if (table && table.seats.length > 0) {
      const firstSeat = table.seats[0];
      this.selectedSeat.set(firstSeat);
      this.selectedUserId.set(firstSeat.userId || '');
      this.selectedGuestType.set(firstSeat.role !== 'Empty' ? firstSeat.role.toLowerCase() as 'vip' | 'guest' | 'speaker' : 'none');
    }
    this.isEditModalOpen.set(true);
  }

  openEditModalForSeat(seat: Seat): void {
    if (!this.canEdit()) {
      return;
    }

    this.ensureUserSummaryLoaded();
    this.selectedSeat.set(seat);
    this.updateTableNumber.set(seat.tableId.replace(/^T/, ''));
    this.selectedUserId.set(seat.userId || '');
    this.selectedGuestType.set(seat.role !== 'Empty' ? seat.role.toLowerCase() as 'vip' | 'guest' | 'speaker' : 'none');
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedSeat.set(null);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.loadSeating();
  }

  clearSelectedSeat(): void {
    this.selectedUserId.set('');
    this.selectedGuestType.set('none');
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  updateSeatingTable(): void {
    if (!this.canEdit()) {
      this.errorMessage.set('You do not have permission to edit seating.');
      return;
    }

    if (!this.seatingId() || !this.updateTableNumber()) {
      this.errorMessage.set('Select a valid seating table and guest first.');
      return;
    }

    if (!this.selectedSeat()) {
      this.errorMessage.set('Select a seat to update first.');
      return;
    }

    if (this.selectedGuestType() !== 'none' && !this.selectedUserId()) {
      this.errorMessage.set('Please select a guest or choose empty seat mode.');
      return;
    }

    this.isUpdatingTable.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const table = this.tables().find((table) => table.id === `T${this.updateTableNumber()}`);
    if (!table) {
      this.errorMessage.set('Selected table not found.');
      this.isUpdatingTable.set(false);
      return;
    }

    const updatedSeats = table.seats.map((seat) => {
      if (seat.id !== this.selectedSeat()?.id) {
        return seat;
      }

      return {
        ...seat,
        userId: this.selectedGuestType() === 'none' ? '' : this.selectedUserId() || '',
        role: this.selectedGuestType() === 'none'
          ? 'Empty'
          : this.selectedGuestType() === 'vip'
            ? 'VIP'
            : this.selectedGuestType() === 'speaker'
              ? 'Speaker'
              : 'Guest'
      };
    });

    const payload: SeatingUpdatePayload = {
      numberOfPeople: table.capacity,
      people: updatedSeats.map((seat) => ({
        userId: seat.userId || '',
        role: this.selectedGuestType() === 'none' ? '' : seat.role.toLowerCase() as 'vip' | 'guest' | 'speaker',
        seat: seat.number.toString()
      }))
    };

    this.api.updateSeatingTable(this.seatingId(), this.updateTableNumber(), payload).subscribe({
      next: (response) => {
        this.tables.set(this.mapSeatingTables(response.data.tables));
        this.isUpdatingTable.set(false);
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Failed to update seating table:', err);
        this.errorMessage.set('Unable to update seating table. Please try again.');
        this.isUpdatingTable.set(false);
      }
    });
  }

  viewSeatDetails(seat: Seat) {
    if (this.selectedSeat()?.id === seat.id) {
      this.selectedSeat.set(null); // Toggle off if clicked again
    } else {
      this.selectedSeat.set(seat);
    }
  }

  getSeatClasses(seat: Seat): string {
    const isSelected = this.selectedSeat()?.id === seat.id;
    
    if (isSelected) {
      return 'bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.8)] border-indigo-400 text-white transform scale-110 z-10';
    }
    
    if (seat.role === 'Empty') {
      return 'bg-transparent border-dashed border-gray-600 text-gray-600 hover:border-gray-400';
    } else if (seat.role === 'VIP') {
      return 'bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/40';
    } else {
      return 'bg-white/[0.05] border-white/10 text-gray-300 hover:bg-white/[0.1] hover:border-white/30';
    }
  }
}
