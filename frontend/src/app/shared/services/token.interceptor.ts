import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {PersistanceService} from "./persistance.service";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private persistanceService: PersistanceService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.persistanceService.get('accessToken');
    request = request.clone({
      setHeaders: {
        Authorization: token ? token : ''
      }
    });

    return next.handle(request)
      .pipe(
        catchError(
          (error: HttpErrorResponse) => this.handleAuthError(error)
        )
      );
  }

  private handleAuthError(err: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (err.status === 401) {
      this.router.navigate(['', 'login']);
    }

    return throwError(err);
  }
}
