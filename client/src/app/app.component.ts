import { Component } from '@angular/core';
import { slideInAnimation } from './animations/route-transition.animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [slideInAnimation],
})
export class AppComponent {
    constructor() {}
}
