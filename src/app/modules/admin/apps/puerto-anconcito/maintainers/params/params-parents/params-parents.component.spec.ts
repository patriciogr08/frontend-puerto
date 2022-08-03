import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamsParentsComponent } from './params-parents.component';

describe('ParamsParentsComponent', () => {
  let component: ParamsParentsComponent;
  let fixture: ComponentFixture<ParamsParentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamsParentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamsParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
