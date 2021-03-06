import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {registerAction} from "../../store/actions/register.action";
import {Observable, Subscription} from "rxjs";
import {isSubmittingSelector} from "../../store/selectors";
import {RegisterRequestInterface} from "../../types/registerRequest.interface";
import {ContactsInterface} from "../../../shared/modules/contacts/types/contacts.interface";
import {contactsSelector} from "../../../shared/modules/contacts/store/selectors";
import {getContactsAction} from "../../../shared/modules/contacts/store/actions/getContacts.action";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  contactsSubscription: Subscription;

  accept = '.png, .jpg, .jpeg';
  hide = true;

  // Selectors
  isSubmitting$: Observable<boolean>;
  contacts$: Observable<ContactsInterface[] | null>;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.fetchContacts();
    this.initializeForm();
    this.initializeValues();
  }

  ngOnDestroy(): void {
    this.contactsSubscription.unsubscribe();
  }

  initializeForm(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
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

  initializeValues(): void {
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector));
    this.contacts$ = this.store.pipe(
      select(contactsSelector),
      filter(contacts => contacts !== null)
    );
    this.contactsSubscription = this.contacts$
      .subscribe((contacts) => {
        this.form.addControl('contacts', new FormArray(
          contacts.map(contact => new FormControl(''))
        ))
      });
  }

  fetchContacts(): void {
    this.store.dispatch(getContactsAction());
  }

  // Методы для вывода массива телефонов и контактов
  get phoneGroups(): FormArray {
    return this.form.get('phones') as FormArray
  }

  get contactGroups(): FormArray {
    return this.form.get('contacts') as FormArray
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
    const request: RegisterRequestInterface = {
      ...this.form.value
    }

    this.store.dispatch(registerAction({request}));
  }
}
