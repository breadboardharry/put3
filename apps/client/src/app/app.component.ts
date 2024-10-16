import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from './animations/route-transition.animations';
import { BackendService } from './services/backend/backend.service';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [slideInAnimation],
})
export class AppComponent implements OnInit {

    constructor(
        private backend: BackendService,
    ) {}

    ngOnInit(): void {

        setInterval(() => {
            this.backend.alive().then((alive) => {
                if (!alive) toast.error('Cannot access to server');
            })
        }, 10000);
    }

}
