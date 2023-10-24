import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { CodeName } from 'src/app/enums/code';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { EnumAppRoute } from 'src/app/enums/routes';

@Component({
    selector: 'app-codelock-page',
    templateUrl: './codelock-page.component.html',
    styleUrls: ['./codelock-page.component.scss']
})
export class CodelockPageComponent implements OnInit {

    public codeName: CodeName = CodeName.MASTER;

    constructor(
        private adminService: AdminService,
        private cookie: CookieService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.init();
    }

    /**
     * Initialize the component
     * @description Redirect to the target route if the user is already logged in
     */
    private async init() {
        // Go to home if no target route is present
        const target = await this.getTargetRoute();
        if (!target) this.reRoute('/' + EnumAppRoute.HOME);

        // Check if a token is present and if it is valid
        if (!this.cookie.check('token')) return;
        const logged = await this.adminService.isLogged();
        if (!logged) return;

        this.reRoute('/' + target);
    }

    /**
     * The code has been validated
     * @description Re-route to the target route
     */
    public onValidate(): void {
        // Re-route to the target route
        this.getTargetRoute().then(target => {
            this.reRoute('/' + (target || EnumAppRoute.HOME));
        });
    }

    /**
     * Get the target route from the query params
     * @returns The target route
     */
    private getTargetRoute(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.route.queryParams.subscribe(params => {
                resolve(params['route'] || '');
            });
        });
    }

    /**
     * Re-route to the given route
     * @param route The route to re-route to
     */
    private reRoute(route: string): void {
        window.location.href = window.location.origin + '/' + route;
    }
}
