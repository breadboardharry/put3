import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitboxCoreComponent } from './hitbox-core.component';

describe('HitboxCoreComponent', () => {
  let component: HitboxCoreComponent;
  let fixture: ComponentFixture<HitboxCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HitboxCoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HitboxCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
