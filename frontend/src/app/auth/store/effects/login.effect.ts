import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {PersistanceService} from "../../../shared/services/persistance.service";
import {Router} from "@angular/router";
import {loginAction, loginFailureAction, loginSuccessAction} from "../actions/login.action";
import {CurrentUserInterface} from "../../../shared/types/currentUser.interface";

@Injectable()
export class LoginEffect {
  login$ = createEffect(() => this.actions$.pipe(
    ofType(loginAction),
    switchMap(({request}) => {
      return this.authService.login(request)
        .pipe(
          map((response: CurrentUserInterface) => {
            this.persistanceService.set('accessToken', response.token)
            return loginSuccessAction({response})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(loginFailureAction({errors: errorResponse.error.errors}))
          })
        )
    })
  ));

  redirectAfterSubmit$ = createEffect(
    () => this.actions$.pipe(
      ofType(loginSuccessAction),
      tap(() => {
        this.router.navigate(['/', 'dashboard']);
      })
    ),
    {
      dispatch: false
    }
  )

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private persistanceService: PersistanceService,
    private router: Router
  ) {
  }
}
