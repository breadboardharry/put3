import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { WebSocketService } from '../services/websocket-service/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAttributionGuard implements CanActivate {

  constructor(private websocket: WebSocketService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const role = this.websocket.role;

    if (role === 'fool' && state.url === '/fool') return true;
    if (role === 'master' && state.url === '/master') return true;

    this.router.navigate(['/home']);
    return false;
  }
}
