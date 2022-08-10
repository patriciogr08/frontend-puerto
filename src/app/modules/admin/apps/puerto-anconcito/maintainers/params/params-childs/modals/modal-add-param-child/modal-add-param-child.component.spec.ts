import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddParamChildComponent } from './modal-add-param-child.component';

describe('ModalAddParamChildComponent', () => {
  let component: ModalAddParamChildComponent;
  let fixture: ComponentFixture<ModalAddParamChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddParamChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddParamChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
