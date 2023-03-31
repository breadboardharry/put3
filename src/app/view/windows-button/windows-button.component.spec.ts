import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowsButtonComponent } from './windows-button.component';

describe('WindowsButtonComponent', () => {
  let component: WindowsButtonComponent;
  let fixture: ComponentFixture<WindowsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowsButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
