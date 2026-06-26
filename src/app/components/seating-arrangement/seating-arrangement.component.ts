import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Seat {
  id: string;
  tableId: string;
  number: number;
  assigneeName: string | null; // null if the seat is unassigned
  role: 'Guest' | 'Speaker' | 'VIP' | 'Empty';
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  seats: Seat[];
}

@Component({
  selector: 'app-seating-arrangement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seating-arrangement.component.html',
  styles: ``
})
export class SeatingArrangementComponent {
  // Dynamic Configuration: [6, 6, 4, 4] means 4 tables total. 
  // Two with 6 seats, two with 4 seats. You can change this to [4,4,4,4,4,4] or [6,6,6,6] etc.
  tableConfiguration = [6, 6, 4, 4];

  // Mock Names for realism
  private mockNames = ['Alex Rivera', 'Jordan Lee', 'Taylor Smith', 'Casey Vance', 'Riley Chen', 'Morgan Stark', 'Sam Wilson', 'Jamie Doe'];

  // Signal holding the table layouts
  tables = signal<Table[]>(this.generateDynamicTables(this.tableConfiguration));
  
  // Signal for the currently viewed seat
  selectedSeat = signal<Seat | null>(null);
  hasSelection = computed(() => this.selectedSeat() !== null);

  private generateDynamicTables(config: number[]): Table[] {
    return config.map((capacity, index) => {
      const tableId = `T${index + 1}`;
      const seats: Seat[] = [];
      
      for (let i = 1; i <= capacity; i++) {
        // Randomly leave some seats empty, otherwise assign a random name
        const isEmpty = Math.random() > 0.85; 
        const randomName = this.mockNames[Math.floor(Math.random() * this.mockNames.length)];
        
        // Randomly assign VIP status to a few people
        const role = isEmpty ? 'Empty' : (Math.random() > 0.9 ? 'VIP' : 'Guest');

        seats.push({
          id: `${tableId}-S${i}`,
          tableId: tableId,
          number: i,
          assigneeName: isEmpty ? null : randomName,
          role: role
        });
      }

      return {
        id: tableId,
        name: `Table ${index + 1}`,
        capacity: capacity,
        seats: seats
      };
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
