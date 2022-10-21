import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { map, Observable, take } from 'rxjs';

import { AuthService } from 'app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.userSubject.pipe(
      take(1),
      map((user) => {
        const isAuthenticated: boolean = !!user;
        return isAuthenticated
          ? true
          : this.router.createUrlTree(['/auth/login']);
      })
    );
  }
}
