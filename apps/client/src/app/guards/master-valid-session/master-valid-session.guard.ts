import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EnumNavbarItemTitle } from 'src/app/enums/dashboard-pages';
import { EnumAppRoute } from 'src/app/enums/routes';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { SessionService } from 'src/app/services/session-service/session.service';
import { TypeService } from 'src/app/services/utils/type/type.service';

@Injectable({
  providedIn: 'root'
})
export class MasterValidSessionGuard  {

    constructor(
        private router: Router,
        private adminService: AdminService,
        private sessionService: SessionService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Check if the user is logged
        return new Promise<boolean>(async (resolve, reject) => {
            // No session code required for admin
            const isAdmin = await this.adminService.isLogged();
            if (isAdmin) return resolve(true);

            // Get the session code
            const URLCode = route.queryParams['code'];
            if (URLCode) {
                this.sessionService.saveInCookies(URLCode);
            }
            const code = this.sessionService.getFromCookies();
            if (!code) return reject();

            this.sessionService.exists(code).then((exists: boolean) => {
                if (!exists) return reject();
                resolve(true);
            });
        })
        .catch(() => {
            this.sessionService.removeFromCookies();
            this.router.navigate(['/' + EnumAppRoute.MASTER + '/session']);
            return false;
        });
    }
}
