import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RickRollComponent } from './rick-roll.component';

describe('RickRollComponent', () => {
  let component: RickRollComponent;
  let fixture: ComponentFixture<RickRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RickRollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RickRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
