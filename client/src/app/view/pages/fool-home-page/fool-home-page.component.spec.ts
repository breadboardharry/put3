import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoolHomePageComponent } from './fool-home-page.component';

describe('FoolHomePageComponent', () => {
  let component: FoolHomePageComponent;
  let fixture: ComponentFixture<FoolHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoolHomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoolHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
