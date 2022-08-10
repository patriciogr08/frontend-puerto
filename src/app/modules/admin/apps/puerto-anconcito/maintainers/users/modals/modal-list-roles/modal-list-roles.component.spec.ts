import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListRolesComponent } from './modal-list-roles.component';

describe('ModalListRolesComponent', () => {
  let component: ModalListRolesComponent;
  let fixture: ComponentFixture<ModalListRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalListRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
