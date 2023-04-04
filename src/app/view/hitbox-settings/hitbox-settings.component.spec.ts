import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitboxSettingsComponent } from './hitbox-settings.component';

describe('HitboxSettingsComponent', () => {
  let component: HitboxSettingsComponent;
  let fixture: ComponentFixture<HitboxSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HitboxSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HitboxSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
