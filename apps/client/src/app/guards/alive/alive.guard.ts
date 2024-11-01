import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/services/api/api.service';

@Injectable({
    providedIn: 'root',
})
export class AliveGuard {
    constructor(private api: APIService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.api.alive().then((alive: boolean) => {
            return alive;
        });
    }
}
