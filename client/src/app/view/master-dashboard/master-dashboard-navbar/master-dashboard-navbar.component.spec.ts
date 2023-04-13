import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDashboardNavbarComponent } from './master-dashboard-navbar.component';

describe('MasterDashboardNavbarComponent', () => {
  let component: MasterDashboardNavbarComponent;
  let fixture: ComponentFixture<MasterDashboardNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDashboardNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDashboardNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
