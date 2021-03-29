import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {CurrentUserInterface} from "../../../shared/types/currentUser.interface";
import {select, Store} from "@ngrx/store";
import {currentUserSelector} from "../../../auth/store/selectors";
import {filter} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {getCustomersAction} from "../../../customers/store/actions/getCustomers.action";
import {CustomersInterface} from "../../../customers/types/customers.interface";
import {customersSelector} from "../../../customers/store/selectors";
import {stringify} from "query-string";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {isSubmittingOrdersSelector} from "../../store/selectors";
import {ActivatedRoute} from "@angular/router";
import {UpdateOrderRequestInterface} from "../../types/updateOrderRequest.interface";

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss']
})
export class OrderCreateComponent implements OnInit, OnDestroy {

  // Стадии
  stages = environment.STAGES;

  subscription: Subscription = new Subscription();
  customerId: string;
  loader: boolean = true;
  form: FormGroup;
  disabled: boolean;
  customers: any[];  // TODO - поменять тип

  // Выбранные услуги
  displayedColumns = ['title', 'quantity', 'amount', 'total', 'remove'];
  servicesListSelected: any[] = [];

  // Временный список услуг
  servicesList = [
    {
      id: '1',
      title: 'Услуга 1',
      amount: 500
    },
    {
      id: '2',
      title: 'Услуга 2',
      amount: 1500
    },
    {
      id: '3',
      title: 'Услуга 3',
      amount: 2400
    },
    {
      id: '4',
      title: 'Услуга 4',
      amount: 4400
    },
    {
      id: '5',
      title: 'Услуга 5',
      amount: 3800
    }
  ];

  // selectors
  currentUser$: Observable<CurrentUserInterface | null>;
  customers$: Observable<CustomersInterface[] | null>;
  isSubmitting$: Observable<boolean>;


  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.queryParams.customerId || '';
    this.initializeValues();
    this.initialListeners();
  }

  initializeValues(): void {
    this.currentUser$ = this.store.pipe(select(currentUserSelector), filter(currentUser => currentUser !== null));
    this.customers$ = this.store.pipe(select(customersSelector), filter(customers => customers !== null));
    this.isSubmitting$ = this.store.pipe(select(isSubmittingOrdersSelector));
  }

  initialListeners(): void {
    this.subscription.add(
      this.currentUser$
        .subscribe(currentUser => {
          const stringifinedParams = stringify({
            limit: Infinity,
            assignedUserId: currentUser.role === 'manager' ? currentUser.id : ''
          });
          this.disabled = currentUser.role === 'manager';
          this.store.dispatch(getCustomersAction({url: `/customers?${stringifinedParams}`}));
        })
    );

    this.subscription.add(
      this.customers$
        .subscribe(customers => {
          this.customers = customers;
          this.loader = false;
          this.initializeForm();
        })
    );
  }

  initializeForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required
      ]),
      stage: new FormControl(this.stages[0].value),
      servicesList: new FormGroup({
        id: new FormControl(this.servicesList[0].id),
        quantity: new FormControl(1, [
          Validators.min(1)
        ])
      }),
      assignedUserId: new FormControl({
        value: null,
        disabled: this.disabled
      }),
      customerId: new FormControl(this.customerId),
      companyId: new FormControl(''), // TODO - потом поменять на переменную
      description: new FormControl(null)
    });

    this.subscription.add(
      this.form.valueChanges
        .subscribe(value => {
          if (value.customerId) {
            this.form.controls['companyId'].disable({emitEvent: false});
            this.form.controls['companyId'].patchValue('', {emitEvent: false});
          } else {
            this.form.controls['companyId'].enable({emitEvent: false});
          }
          if (value.companyId) {
            this.form.controls['customerId'].disable({emitEvent: false});
            this.form.controls['customerId'].patchValue('', {emitEvent: false});
          } else {
            this.form.controls['customerId'].enable({emitEvent: false});
          }
        })
    );
  }

  onSubmit(): void {
    const request: UpdateOrderRequestInterface = {
      ...this.form.value,
      servicesList: this.servicesListSelected.map(service => {
        delete service.id;
        return service;
      }),
      documentIds: []
    }
    if (!request.hasOwnProperty('customerId')) {
      request.customerId = '';
    }

    if (!request.hasOwnProperty('companyId')) {
      request.companyId = '';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  redirectToBack(): void {

  }

  addService(): void {
    // Ищем выбранную услугу в массиве
    const serviceSelected = this.servicesList.find(service => service.id === this.form.controls['servicesList'].value.id);
    // Добавляем услугу в список
    this.servicesListSelected = this.servicesListSelected.concat([{
      title: serviceSelected.title,
      amount: serviceSelected.amount,
      quantity: Number(this.form.controls['servicesList'].value.quantity) ? this.form.controls['servicesList'].value.quantity : 1,
      id: serviceSelected.id
    }]);
    // Удаляем услугу из массива
    this.servicesList = this.servicesList.filter(service => service.id != serviceSelected.id);
    this.form.controls['servicesList'].patchValue({
      id: this.servicesList[0] ? this.servicesList[0].id : null,
      quantity: 1
    });
  }

  removeService(id: string) {
    const removeService = this.servicesListSelected.find(service => service.id === id);
    this.servicesList = this.servicesList.concat(removeService);
    this.servicesListSelected = this.servicesListSelected.filter(service => service.id !== id);
  }

  // Подсчет итоговой суммы заказа
  getTotalCost(): number {
    return this.servicesListSelected.reduce((acc, value) => acc + value.amount * +value.quantity, 0);
  }

  // Сгенерировать документ
  generateDoc(): void {

  }
}
