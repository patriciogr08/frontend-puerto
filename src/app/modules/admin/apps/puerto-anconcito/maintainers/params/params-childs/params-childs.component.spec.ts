import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamsChildsComponent } from './params-childs.component';

describe('ParamsChildsComponent', () => {
  let component: ParamsChildsComponent;
  let fixture: ComponentFixture<ParamsChildsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamsChildsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamsChildsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
