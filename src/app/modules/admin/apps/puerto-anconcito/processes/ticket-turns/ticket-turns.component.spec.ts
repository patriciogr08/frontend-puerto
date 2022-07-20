import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTurnsComponent } from './ticket-turns.component';

describe('TicketTurnsComponent', () => {
  let component: TicketTurnsComponent;
  let fixture: ComponentFixture<TicketTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketTurnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
