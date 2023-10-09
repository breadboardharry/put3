import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from 'src/app/enums/routes';
import { SessionService } from 'src/app/services/session-service/session.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';

@Component({
    selector: 'app-session-enter-page',
    templateUrl: './session-enter-page.component.html',
    styleUrls: ['./session-enter-page.component.scss']
})
export class SessionEnterPageComponent {

    public code: string = "";
    public loading: boolean = false;

    constructor(
        private router: Router,
        private sessionService: SessionService,
        private snackbar: SnackbarService
    ) { }

    public validate(): void {
        if (!this.code) return;
        this.loading = true;

        this.sessionService.exists(this.code).then((exists: boolean) => {
            this.loading = false;
            if (!exists) {
                this.snackbar.openError("No session found");
                return;
            }
            this.router.navigate([Route.MASTER], { queryParams: { code: this.code } });
        });
    }

    public get disabled(): boolean {
        return this.code.length < 5;
    }

}
