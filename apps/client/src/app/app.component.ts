import { Component, Injector, OnInit } from '@angular/core';
import { slideInAnimation } from './animations/route-transition.animations';
import { APIService } from './services/api/api.service';
import { toast } from 'ngx-sonner';
import { MediaFactory } from './providers/media';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
    constructor(private api: APIService, private injector: Injector) {}

    ngOnInit(): void {
        /**
         * Inject the injector into the MediaFactory
         * It will be used to inject the services into the media instances
         */
        MediaFactory.injector = this.injector;

        setInterval(() => {
            this.api.alive().then((alive) => {
                if (!alive) toast.error('Cannot access to server');
            });
        }, 10000);
    }
}
