import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ForgetComponent} from "../forget/forget.component";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {successMessageSelector} from "../../store/selectors";

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
  }

  onSubmit(): void {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ForgetComponent);
  }
}
