import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodelockComponent } from './codelock.component';

describe('CodelockComponent', () => {
  let component: CodelockComponent;
  let fixture: ComponentFixture<CodelockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodelockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodelockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
