import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatingArrangementComponent } from './seating-arrangement.component';

describe('SeatingArrangementComponent', () => {
  let component: SeatingArrangementComponent;
  let fixture: ComponentFixture<SeatingArrangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatingArrangementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatingArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
