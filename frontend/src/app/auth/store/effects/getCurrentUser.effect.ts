import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap} from "rxjs/operators";
import {CurrentUserInterface} from "../../../shared/types/currentUser.interface";
import {of} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {PersistanceService} from "../../../shared/services/persistance.service";
import {
  getCurrentUserAction,
  getCurrentUserFailureAction,
  getCurrentUserSuccessAction
} from "../actions/getCurrentUser.action";

@Injectable()
export class GetCurrentUserEffect {
  getCurrentUser$ = createEffect(() => this.actions$.pipe(
    ofType(getCurrentUserAction),
    switchMap(() => {
      const token = this.persistanceService.get('accessToken');
      if (!token) {
        return of(getCurrentUserFailureAction());
      }
      return this.authService.getCurrentUser()
        .pipe(
          map((response: CurrentUserInterface) => {
            return getCurrentUserSuccessAction({response})
          }),
          catchError(() => {
            return of(getCurrentUserFailureAction())
          })
        )
    })
  ));

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private persistanceService: PersistanceService
  ) {
  }
}
