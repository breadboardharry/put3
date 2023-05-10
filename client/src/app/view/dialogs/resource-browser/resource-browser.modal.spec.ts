import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceBrowserModal } from './resource-browser.modal';

describe('ResourceBrowserComponent', () => {
  let component: ResourceBrowserModal;
  let fixture: ComponentFixture<ResourceBrowserModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceBrowserModal ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceBrowserModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
