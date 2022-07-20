import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseTurnsComponent } from './close-turns.component';

describe('CloseTurnsComponent', () => {
  let component: CloseTurnsComponent;
  let fixture: ComponentFixture<CloseTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseTurnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
