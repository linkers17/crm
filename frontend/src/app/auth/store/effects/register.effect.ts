import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {registerAction, registerFailureAction, registerSuccessAction} from "../actions/register.action";
import {catchError, delay, map, switchMap, tap} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {RegisterResponseInterface} from "../../types/registerResponse.interface";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {PersistanceService} from "../../../shared/services/persistance.service";
import {Router} from "@angular/router";

@Injectable()
export class RegisterEffect {
  register$ = createEffect(() => this.actions$.pipe(
    ofType(registerAction),
    switchMap(({request}) => {
      return this.authService.register(request)
        .pipe(
          map((response: RegisterResponseInterface) => {
            return registerSuccessAction({response})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(registerFailureAction({errors: errorResponse.error.errors}))
          })
        )
    })
  ));

  redirectAfterSubmit$ = createEffect(
    () => this.actions$.pipe(
      ofType(registerSuccessAction),
      delay(10),
      tap(() => {
        this.router.navigate(['/', 'login']);
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
