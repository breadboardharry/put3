import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from './animations/route-transition.animations';
import { SnackbarService } from './services/snackbar-service/snackbar.service';
import { BackendService } from './services/backend/backend.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [slideInAnimation],
})
export class AppComponent implements OnInit {

    constructor(
        private backend: BackendService,
        private snackbar: SnackbarService
    ) {}

    ngOnInit(): void {

        setInterval(() => {
            this.backend.alive().then((alive) => {
                if (!alive) this.snackbar.openError('Cannot access to server');
            })
        }, 10000);
    }

}
