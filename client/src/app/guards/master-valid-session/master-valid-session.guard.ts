import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from 'src/app/enums/routes';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { SessionService } from 'src/app/services/session-service/session.service';

@Injectable({
  providedIn: 'root'
})
export class MasterValidSessionGuard implements CanActivate {

    constructor(
        private router: Router,
        private adminService: AdminService,
        private sessionService: SessionService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Check if the user is logged
        return new Promise<boolean>(async (resolve, reject) => {
            const isAdmin = await this.adminService.isLogged();
            if (isAdmin) return resolve(true);

            const code = route.queryParams['code'];
            if (!code) return reject();

            this.sessionService.exists(code).then((exists: boolean) => {
                if (!exists) return reject();
                resolve(true);
            });
        })
        .catch(() => {
            this.router.navigate(['/' + Route.MASTER + '/session']);
            return false;
        });
    }
}
