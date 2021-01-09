import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ForgetComponent} from "../forget/forget.component";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {isSubmittingSelector, successMessageSelector, validationErrorsSelector} from "../../store/selectors";
import {RegisterRequestInterface} from "../../types/registerRequest.interface";
import {loginAction} from "../../store/actions/login.action";
import {BackendErrorsInterface} from "../../../shared/types/backendErrors.interface";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  hide = true;

  // Selectors
  successMessages$: Observable<string | null>;
  isSubmitting$: Observable<boolean>;
  backendErrors$: Observable<BackendErrorsInterface | null>;

  constructor(
    public dialog: MatDialog,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeValues();
  }

  initializeForm(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-z0-9]+$/m)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]+$/m)
      ])
    });
  }

  initializeValues(): void {
    this.successMessages$ = this.store
      .pipe(
        select(successMessageSelector)
      );
    this.isSubmitting$ = this.store
      .pipe(
        select(isSubmittingSelector)
      );
    this.backendErrors$ = this.store
      .pipe(
        select(validationErrorsSelector)
      );
  }

  onSubmit(): void {
    const request: RegisterRequestInterface = {
      ...this.form.value
    }

    this.store.dispatch(loginAction({request}));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ForgetComponent);
  }
}
