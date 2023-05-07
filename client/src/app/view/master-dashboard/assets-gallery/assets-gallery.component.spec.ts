import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsGalleryComponent } from './assets-gallery.component';

describe('AssetsGalleryComponent', () => {
  let component: AssetsGalleryComponent;
  let fixture: ComponentFixture<AssetsGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
