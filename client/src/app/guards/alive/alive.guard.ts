import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend/backend.service';

@Injectable({
    providedIn: 'root',
})
export class AliveGuard implements CanActivate {

    constructor(private backendService: BackendService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.backendService.alive().then((alive: boolean) => {
            return alive;
        });
    }
}
