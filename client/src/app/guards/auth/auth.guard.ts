import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccessControlService } from 'src/app/services/access-control-service/access-control.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AccessControlService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Check if the user is logged
        return this.authService.isLogged().then((logged: boolean) => {
            if (logged) return true;

            this.router.navigate(['/control'], { queryParams: { route: state.url.replace('/', '') } });
            return false;
        })
        .catch(() => {
            this.router.navigate(['/control'], { queryParams: { route: state.url.replace('/', '') } });
            return false;
        });
    }
}
