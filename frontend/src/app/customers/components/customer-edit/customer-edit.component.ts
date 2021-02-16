import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {Observable, Subscription} from "rxjs";
import {GetCustomerInterface} from "../../types/getCustomer.interface";
import {select, Store} from "@ngrx/store";
import {
  currentCustomerSelector,
  isLoadingCustomersSelector,
  isSubmittingCustomersSelector
} from "../../store/selectors";
import {ActivatedRoute} from "@angular/router";
import {getCustomerByIdAction} from "../../store/actions/getCustomer.action";
import {filter} from "rxjs/operators";
import {CurrentUserInterface} from "../../../shared/types/currentUser.interface";
import {currentUserSelector} from "../../../auth/store/selectors";
import {UpdateCustomerRequestInterface} from "../../types/updateCustomerRequest.interface";
import {updateCustomerAction} from "../../store/actions/updateCustomer.action";

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit, OnDestroy {

  // selectors
  isSubmitting$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  currentUser$: Observable<CurrentUserInterface | null>;

  customer: GetCustomerInterface;
  id: string;
  doNotCall: boolean; // checkbox
  disabled: boolean;        // Флаг для блокировки селектора с выбором менеджера

  subscription: Subscription = new Subscription();

  form: FormGroup;

  constructor(
    private location: Location,
    private store: Store,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeValues();
    this.initializeListeners();
    this.store.dispatch(getCustomerByIdAction({id: this.id}));
  }

  initializeValues(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.currentUser$ = this.store.pipe(select(currentUserSelector));
    this.subscription.add(this.currentUser$.pipe(filter(currentUser => currentUser !== null)).subscribe(currentUser => this.disabled = currentUser.role === 'manager'));
    this.isLoading$ = this.store.pipe(select(isLoadingCustomersSelector));
    this.isSubmitting$ = this.store.pipe(select(isSubmittingCustomersSelector));
  }

  initializeListeners(): void {
    this.subscription.add(
      this.store.pipe(
        select(currentCustomerSelector),
        filter(currentCustomer => currentCustomer !== null))
        .subscribe((currentCustomer: GetCustomerInterface[]) => {
          this.customer = currentCustomer[0];
          this.doNotCall = this.customer.doNotCall;
          this.initializeForm();
        })
    );
  }

  initializeForm(): void {
    this.form = new FormGroup({
      surname: new FormControl(this.customer.surname, [
        Validators.required
      ]),
      name: new FormControl(this.customer.name, [
        Validators.required
      ]),
      patronym: new FormControl(this.customer.patronym, [
        Validators.required
      ]),
      birthday: new FormControl(this.customer.birthday, [
        Validators.required
      ]),
      email: new FormControl(this.customer.email, [
        Validators.required,
        Validators.email
      ]),
      site: new FormControl(this.customer.site),
      addressPostalCode: new FormControl(this.customer.addressPostalCode, [
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern(/^[0-9]+$/m),
        Validators.required
      ]),
      addressCity: new FormControl(this.customer.addressCity, [
        Validators.required
      ]),
      addressStreet: new FormControl(this.customer.addressStreet, [
        Validators.required
      ]),
      addressHome: new FormControl(this.customer.addressHome, [
        Validators.required
      ]),
      addressRoom: new FormControl(this.customer.addressRoom, [
        Validators.pattern(/^[0-9]+$/m)
      ]),
      phones: new FormArray(
        <FormControl[]>this.customer.phones.map(phone => {
          return new FormControl(phone.replace('+7', ''), [
            Validators.required,
            Validators.pattern(/^[0-9]+$/m),
            Validators.maxLength(10)
          ])
        })
      ),
      contacts: new FormArray(
        <FormControl[]>this.customer.contactsList.map(contact => {
          return new FormControl(contact.value)
        })
      ),
      assignedUserId: new FormControl({
        value: this.customer.assignedUserId,
        disabled: this.disabled
      }),
      description: new FormControl(this.customer.description)
    });
  }

  onSubmit(id: string): void {
    const request: UpdateCustomerRequestInterface = {
      ...this.form.value,
      phones: this.form.value.phones.map((phone: string) => `+7${phone}`),
      doNotCall: this.doNotCall,
      documentIds: []   // TODO - потом добавить редактирование документов
    };
    this.store.dispatch(updateCustomerAction({id, request}));
  }

  redirectToBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
}
