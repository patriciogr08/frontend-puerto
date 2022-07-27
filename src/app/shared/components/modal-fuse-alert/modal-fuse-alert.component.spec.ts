import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFuseAlertComponent } from './modal-fuse-alert.component';

describe('ModalFuseAlertComponent', () => {
  let component: ModalFuseAlertComponent;
  let fixture: ComponentFixture<ModalFuseAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFuseAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFuseAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
