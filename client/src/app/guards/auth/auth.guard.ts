import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from 'src/app/enums/routes';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Check if the user is logged
        return this.authService.isLogged().then((logged: boolean) => {
            if (logged) return true;

            this.router.navigate(['/' + Route.LOGIN], { queryParams: { route: state.url.replace('/', '') } });
            return false;
        })
        .catch(() => {
            this.router.navigate(['/' + Route.LOGIN], { queryParams: { route: state.url.replace('/', '') } });
            return false;
        });
    }
}
