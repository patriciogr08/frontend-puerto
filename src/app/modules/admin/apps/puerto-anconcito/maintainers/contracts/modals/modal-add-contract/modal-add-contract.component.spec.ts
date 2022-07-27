import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddContractComponent } from './modal-add-contract.component';

describe('ModalAddContractComponent', () => {
  let component: ModalAddContractComponent;
  let fixture: ComponentFixture<ModalAddContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
