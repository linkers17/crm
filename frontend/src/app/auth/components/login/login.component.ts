import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ForgetComponent} from "../forget/forget.component";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {isSubmittingSelector} from "../../store/selectors";
import {RegisterRequestInterface} from "../../types/registerRequest.interface";
import {loginAction} from "../../store/actions/login.action";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  hide = true;

  // Selectors
  isSubmitting$: Observable<boolean>;

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
    this.isSubmitting$ = this.store
      .pipe(
        select(isSubmittingSelector)
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
