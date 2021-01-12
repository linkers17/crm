import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {select, Store} from "@ngrx/store";
import {currentUserSelector} from "../../auth/store/selectors";
import {filter, first, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotManagerGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private router: Router,
    private store: Store
  ) {
  }

  roleUser$ = this.store.pipe(
    select(currentUserSelector),
    filter(currentUser => currentUser !== null),
    map(currentUser => currentUser.role)
  );

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.whatRole();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.whatRole();
  }

  private whatRole(): Observable<boolean> {
    return this.roleUser$.pipe(
      first(),
      map(role => {
        if (role === 'manager') {
          this.router.navigate(['/', 'dashboard']);
        }
        return true;
      })
    );
  }
}
