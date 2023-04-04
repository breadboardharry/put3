import { Component, OnInit } from '@angular/core';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {

  // Background image set default
  backgroundImage: string = 'assets/images/default-desktop-background.jpg';

  constructor(private desktopService: DesktopService) { }

  ngOnInit(): void {
    // Get desktop background image
    this.desktopService.getBackground().then(image => {
      this.backgroundImage = image;
    });
  }

}
