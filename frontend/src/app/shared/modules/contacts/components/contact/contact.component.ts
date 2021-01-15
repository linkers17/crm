import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  form: FormGroup

  // selectors
  isSubmitting$: Observable<boolean>

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {

  }

  initializeForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required
      ])
    });
  }
}
