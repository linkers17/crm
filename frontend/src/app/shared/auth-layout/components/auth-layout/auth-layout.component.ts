import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {BackendErrorsInterface} from "../../../types/backendErrors.interface";
import {select, Store} from "@ngrx/store";
import {successMessageSelector, validationErrorsSelector} from "../../../../auth/store/selectors";
import {BackendMessagesInterface} from "../../../types/backendMessages.interface";
import {titlePageSelector} from "../../../store/selectors";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

  // selectors
  backendErrors$: Observable<BackendErrorsInterface | null>;
  successMessages$: Observable<BackendMessagesInterface | null>;
  page$: Observable<string>;

  constructor(
    private router: Router,
    private store: Store
  ) { }

  links = [
    {title: 'Вход', nav: 'login'},
    {title: 'Регистрация', nav: 'register'}
  ];
  activeLink: string;

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues(): void {
    this.successMessages$ = this.store.pipe(select(successMessageSelector));
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector));
    this.page$ = this.store.pipe(
      select(titlePageSelector),
      map(obj => obj.page)
    );
  }

}
