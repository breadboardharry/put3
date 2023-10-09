import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from 'src/app/enums/routes';
import { SessionService } from 'src/app/services/session-service/session.service';

@Injectable({
  providedIn: 'root'
})
export class MasterValidSessionGuard implements CanActivate {

    constructor(private router: Router, private sessionService: SessionService) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Check if the user is logged
        return new Promise<boolean>((resolve, reject) => {
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
