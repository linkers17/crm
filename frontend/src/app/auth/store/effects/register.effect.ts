import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {registerAction, registerFailureAction, registerSuccessAction} from "../actions/register.action";
import {catchError, map, switchMap} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {RegisterResponseInterface} from "../../types/registerResponse.interface";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

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

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {
  }
}
