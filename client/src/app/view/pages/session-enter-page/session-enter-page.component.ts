import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from 'src/app/enums/routes';
import { SessionService } from 'src/app/services/session-service/session.service';
import { SnackbarService } from 'src/app/services/snackbar-service/snackbar.service';
import { CodeInputComponent } from '../../common/code-input/code-input.component';

@Component({
    selector: 'app-session-enter-page',
    templateUrl: './session-enter-page.component.html',
    styleUrls: ['./session-enter-page.component.scss']
})
export class SessionEnterPageComponent implements AfterViewInit {

    @ViewChild('codeInput')
    public codeInput!: CodeInputComponent;

    public codeLength: number = 5;
    public code: string = "";
    public loading: boolean = false;

    constructor(
        private router: Router,
        private sessionService: SessionService,
        private snackbar: SnackbarService
    ) { }

    ngAfterViewInit(): void {
        this.codeInput.focusOnField(0);
    }

    public validate(): void {
        if (!this.code) return;
        this.loading = true;

        this.sessionService.exists(this.code).then((exists: boolean) => {
            this.loading = false;
            if (!exists) {
                setTimeout(() => {
                    this.codeInput.focusOnField(this.code.length - 1);
                }, 100);
                this.snackbar.openError("No session found");
                return;
            }
            this.router.navigate([Route.MASTER], { queryParams: { code: this.code } });
        });
    }

    public get disabled(): boolean {
        return this.code.length < 5;
    }

    public onCodeChanged(code: string) {
        this.code = code;
    }

    public onEnterPressed() {
        this.validate();
    }

    private adminAccess: { timeoutDuration: number, neededTries: number, timeout?: NodeJS.Timeout, activeTries: number } = {
        timeoutDuration: 500,
        neededTries: 5,
        timeout: undefined,
        activeTries: 0,
    }
    public tryAdminAccess(): void {
        this.adminAccess.activeTries++;

        if (this.adminAccess.activeTries >= this.adminAccess.neededTries) {
            this.snackbar.openSuccess("Admin access :)");
            this.router.navigate([Route.LOGIN], { queryParams: { route: Route.MASTER } });
            return;
        }

        if (this.adminAccess.timeout) clearTimeout(this.adminAccess.timeout);
        this.adminAccess.timeout = setTimeout(() => {
            this.adminAccess.activeTries = 0;
        }, this.adminAccess.timeoutDuration);
    }

}
