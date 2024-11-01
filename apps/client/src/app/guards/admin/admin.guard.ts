import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EnumAppRoute } from 'src/app/enums/routes';
import { AdminService } from 'src/app/services/admin-service/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {

    constructor(
        private adminService: AdminService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Check if the user is logged
        return this.adminService.isLogged().then((logged: boolean) => {
            if (logged) return true;

            this.router.navigate(['/' + EnumAppRoute.LOGIN], { queryParams: { route: state.url.replace('/', '') } });
            return false;
        })
        .catch(() => {
            this.router.navigate(['/' + EnumAppRoute.LOGIN], { queryParams: { route: state.url.replace('/', '') } });
            return false;
        });
    }
}
