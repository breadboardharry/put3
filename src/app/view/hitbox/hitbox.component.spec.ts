import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitboxComponent } from './hitbox.component';

describe('HitboxComponent', () => {
  let component: HitboxComponent;
  let fixture: ComponentFixture<HitboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HitboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HitboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
