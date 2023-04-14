import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodelockPageComponent } from './codelock-page.component';

describe('CodelockPageComponent', () => {
  let component: CodelockPageComponent;
  let fixture: ComponentFixture<CodelockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodelockPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodelockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
