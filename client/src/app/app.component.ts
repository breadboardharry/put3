import { Component } from '@angular/core';
import { slideInAnimation } from './animations/route-transition.animations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation ]
})
export class AppComponent {

  constructor() {
    console.log('environment.apiUrl: ' + environment.apiUrl);
  }


}
