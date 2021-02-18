import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {select, Store} from "@ngrx/store";
import {Observable, Subscription} from "rxjs";
import {isLoadingCustomersSelector, isSubmittingCustomersSelector} from "../../store/selectors";
import {ContactsInterface} from "../../../shared/modules/contacts/types/contacts.interface";
import {contactsSelector} from "../../../shared/modules/contacts/store/selectors";
import {filter} from "rxjs/operators";
import {CurrentUserInterface} from "../../../shared/types/currentUser.interface";
import {currentUserSelector} from "../../../auth/store/selectors";
import {getContactsAction} from "../../../shared/modules/contacts/store/actions/getContacts.action";
import {UpdateCustomerRequestInterface} from "../../types/updateCustomerRequest.interface";
import {createCustomerAction} from "../../store/actions/createCustomer.action";

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit, OnDestroy {

  form: FormGroup;
  doNotCall: boolean = false;
  disabled: boolean;        // Флаг для блокировки селектора с выбором менеджера

  subscription: Subscription = new Subscription();

  // selectors
  isSubmitting$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  contacts$: Observable<ContactsInterface[] | null>;
  currentUser$: Observable<CurrentUserInterface | null>;

  constructor(
    private location: Location,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.fetchContacts();
    this.initializeForm();
    this.initializeValues();
  }

  initializeValues(): void {
    this.contacts$ = this.store.pipe(
      select(contactsSelector),
      filter(contacts => contacts !== null)
    );
    this.subscription.add(this.contacts$
      .subscribe((contacts) => {
        this.form.addControl('contacts', new FormArray(
          contacts.map(contact => new FormControl(''))
        ))
      }));
    this.currentUser$ = this.store.pipe(select(currentUserSelector));
    this.subscription.add(this.currentUser$.pipe(filter(currentUser => currentUser !== null)).subscribe(currentUser => this.disabled = currentUser.role === 'manager'));
    this.isLoading$ = this.store.pipe(select(isLoadingCustomersSelector));
    this.isSubmitting$ = this.store.pipe(select(isSubmittingCustomersSelector));
  }

  initializeForm(): void {
    this.form = new FormGroup({
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
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      site: new FormControl(null),
      addressPostalCode: new FormControl(null, [
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern(/^[0-9]+$/m),
        Validators.required
      ]),
      addressCity: new FormControl(null, [
        Validators.required
      ]),
      addressStreet: new FormControl(null, [
        Validators.required
      ]),
      addressHome: new FormControl(null, [
        Validators.required
      ]),
      addressRoom: new FormControl(null, [
        Validators.pattern(/^[0-9]+$/m)
      ]),
      phones: new FormArray([
        new FormControl(null, [
            Validators.required,
            Validators.pattern(/^[0-9]+$/m),
            Validators.maxLength(10)
          ])
        ]
      ),
      assignedUserId: new FormControl({
        value: null,
        disabled: this.disabled
      }),
      description: new FormControl(null)
    });
  }

  fetchContacts(): void {
    this.store.dispatch(getContactsAction());
  }

  onSubmit(): void {
    const request: UpdateCustomerRequestInterface = {
      ...this.form.value,
      phones: this.form.value.phones.map((phone: string) => `+7${phone}`),
      doNotCall: this.doNotCall,
      documentIds: []   // TODO - потом добавить редактирование документов
    };
    this.store.dispatch(createCustomerAction({request}));
  }

  redirectToBack(): void {
    this.location.back();
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

  // Методы для вывода массива телефонов и контактов
  get phoneGroups(): FormArray {
    return this.form.get('phones') as FormArray
  }

  get contactGroups(): FormArray {
    return this.form.get('contacts') as FormArray
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
