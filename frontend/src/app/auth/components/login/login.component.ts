import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  hide = true;

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
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

  onSubmit(): void {

  }
}
