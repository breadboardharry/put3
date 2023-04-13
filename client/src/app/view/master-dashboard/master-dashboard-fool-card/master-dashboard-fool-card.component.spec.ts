import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDashboardFoolCardComponent } from './master-dashboard-fool-card.component';

describe('MasterDashboardFoolCardComponent', () => {
  let component: MasterDashboardFoolCardComponent;
  let fixture: ComponentFixture<MasterDashboardFoolCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDashboardFoolCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDashboardFoolCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
