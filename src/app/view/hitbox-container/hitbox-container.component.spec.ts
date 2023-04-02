import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitboxContainerComponent } from './hitbox-container.component';

describe('HitboxContainerComponent', () => {
  let component: HitboxContainerComponent;
  let fixture: ComponentFixture<HitboxContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HitboxContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HitboxContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
