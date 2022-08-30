import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordChargesComponent } from './record-charges.component';

describe('RecordChargesComponent', () => {
  let component: RecordChargesComponent;
  let fixture: ComponentFixture<RecordChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
