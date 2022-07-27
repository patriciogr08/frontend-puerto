import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderActionButtonsComponent } from './render-action-buttons.component';

describe('RenderActionButtonsComponent', () => {
  let component: RenderActionButtonsComponent;
  let fixture: ComponentFixture<RenderActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderActionButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
