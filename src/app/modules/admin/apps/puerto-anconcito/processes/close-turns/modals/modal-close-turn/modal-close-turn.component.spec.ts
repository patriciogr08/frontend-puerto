import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCloseTurnComponent } from './modal-close-turn.component';

describe('ModalCloseTurnComponent', () => {
  let component: ModalCloseTurnComponent;
  let fixture: ComponentFixture<ModalCloseTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCloseTurnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCloseTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
