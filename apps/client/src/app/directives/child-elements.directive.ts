import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[childElements]'
})
export class ChildElementsDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
