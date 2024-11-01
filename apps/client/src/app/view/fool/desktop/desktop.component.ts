import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChildElementsDirective } from 'src/app/directives/child-elements.directive';
import { DesktopService } from 'src/app/services/desktop-service/desktop.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  // Background image set default
  @Input() backgroundImage: string = environment.defaultDesktopImage;
  @ViewChild(ChildElementsDirective, { static: true }) childElements!: ChildElementsDirective;
  childElementsContainerRef!: ViewContainerRef;

  constructor(private desktopService: DesktopService) { }

  ngOnInit(): void {
    // Get reference to the component container
    this.childElementsContainerRef = this.childElements.viewContainerRef;
    this.childElementsContainerRef.clear();
    // And send it to the service
    this.desktopService.containerRef = this.childElementsContainerRef;
  }
}
