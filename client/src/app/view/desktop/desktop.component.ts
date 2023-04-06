import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChildElementsDirective } from 'src/app/directives/child-elements.directive';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {

  @ViewChild(ChildElementsDirective, {static: true}) childElements!: ChildElementsDirective;
  childElementsContainerRef!: ViewContainerRef;

  // Background image set default
  backgroundImage: string = 'assets/images/default-desktop-background.jpg';

  constructor(private desktopService: DesktopService) { }

  ngOnInit(): void {
    // Get reference to the component container
    this.childElementsContainerRef = this.childElements.viewContainerRef;
    this.childElementsContainerRef.clear();
    // And send it to the service
    this.desktopService.containerRef = this.childElementsContainerRef;

    // Get desktop background image
    this.desktopService.getBackground().then(image => {
      this.backgroundImage = image;
    });
  }

}
