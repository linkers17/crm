import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  accept = '.png, .jpg, .jpeg';
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
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]+$/m)
      ]),
      surname: new FormControl(null, [
        Validators.required
      ]),
      name: new FormControl(null, [
        Validators.required
      ]),
      patronym: new FormControl(null, [
        Validators.required
      ]),
      birthday: new FormControl(null, [
        Validators.required
      ]),
      userImg: new FormControl(null),
      address: new FormControl(null, [
        Validators.required
      ]),
      phones: new FormArray([
        new FormControl('', [
          Validators.required,
          Validators.pattern(/^[0-9]+$/m),
          Validators.maxLength(10)
        ])
      ])
    });
  }

  // Метод для вывода массива телефонов
  get phoneGroups(): FormArray {
    return this.form.get('phones') as FormArray
  }

  addPhone(): void {
    (<FormArray>this.form.controls.phones).push(new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[0-9]+$/m),
      Validators.maxLength(10)
    ]));
  }

  removePhone(id: number): void {
    (<FormArray>this.form.controls.phones).removeAt(id);
  }

  onSubmit(): void {
    console.log('form', this.form);
    console.log('values', this.form.value);
  }
}
