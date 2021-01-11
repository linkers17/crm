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
import {Observable, of} from 'rxjs';
import {PersistanceService} from "../services/persistance.service";
import {select, Store} from "@ngrx/store";
import {isLoggedInSelector} from "../../auth/store/selectors";
import {filter, first, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private router: Router,
    private persistanceService: PersistanceService,
    private store: Store
  ) {
  }

  isAuth$ = this.store.pipe(
    select(isLoggedInSelector),
    filter(isLoggedIn => isLoggedIn !== null),
    map(isLoggedIn => !!isLoggedIn)
  );

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.getIsAuth();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.getIsAuth();
  }

  private getIsAuth(): Observable<boolean> {

    return this.isAuth$
      .pipe(
        first(),
        map(isAuth => {
          if (!isAuth) {
            this.router.navigate(['/', 'login']);
          }
          return isAuth;
        })
      );
  }
}
