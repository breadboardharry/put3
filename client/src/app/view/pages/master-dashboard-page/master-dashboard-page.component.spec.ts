import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDashboardPageComponent } from './master-dashboard-page.component';

describe('MasterDashboardPageComponent', () => {
  let component: MasterDashboardPageComponent;
  let fixture: ComponentFixture<MasterDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDashboardPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
