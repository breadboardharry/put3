import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaInfoboxComponent } from './media-infobox.component';

describe('MediaInfoboxComponent', () => {
  let component: MediaInfoboxComponent;
  let fixture: ComponentFixture<MediaInfoboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaInfoboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaInfoboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
