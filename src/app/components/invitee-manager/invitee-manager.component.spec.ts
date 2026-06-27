import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteeManagerComponent } from './invitee-manager.component';

describe('InviteeManagerComponent', () => {
  let component: InviteeManagerComponent;
  let fixture: ComponentFixture<InviteeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteeManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
