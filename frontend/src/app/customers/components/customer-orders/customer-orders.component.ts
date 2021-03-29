import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import * as _moment from 'moment';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {environment} from "../../../../environments/environment";
import {merge, Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {currentUserSelector} from "../../../auth/store/selectors";
import {CurrentUserInterface} from "../../../shared/types/currentUser.interface";
import {countOrdersSelector, ordersSelector} from "../../../orders/store/selectors";
import {OrdersInterface} from "../../../orders/types/orders.interface";
import {filter, first, tap} from "rxjs/operators";
import {stringify} from "query-string";
import {DatePipe} from "@angular/common";
import {getOrdersAction} from "../../../orders/store/actions/getOrders.action";

const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY'
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MM.YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MM.YYYY'
  }
}

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    }
  ]
})
export class CustomerOrdersComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('customerId') customerIdProps: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  disabled: boolean;
  idCustomer: string;
  queryParams: any = {};   // Параметры фильтра
  ordersCount: number;    // Всего заказов без фильтра

  date = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // ТАБЛИЦА
  displayedColumns: string[] = [
    'title',
    'stage',
    'createdAt',
    'amount',
    'dateEnd',
    'assignedUserLogin',
    'view',
    'remove'
  ];
  dataSource: MatTableDataSource<OrdersInterface>;

  // Временные значения стадий заказа
  stagesList = environment.STAGES;

  // selectors
  currentUser$: Observable<CurrentUserInterface | null>;
  countOrders$: Observable<number | null>;
  orders$: Observable<OrdersInterface[] | null>;

  subscription: Subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  // сортировка и пагинация таблицы
  ngAfterViewInit(): void {

    this.initializeListeners();

    let sort$ = this.sort.sortChange.pipe(
      tap(() => this.paginator.pageIndex = 0)
    );

    this.subscription.add(
      merge(sort$, this.paginator.page)
        .pipe(
          tap(() => this.initializeListeners())
        )
        .subscribe()
    );
  }

  ngOnInit(): void {
    this.initializeValues();
    this.initializeForm();
  }

  initializeValues(): void {
    this.currentUser$ = this.store.pipe(select(currentUserSelector));
    this.countOrders$ = this.store.pipe(select(countOrdersSelector));
    this.subscription.add(
      this.countOrders$
        .pipe(
          filter(count => count !== null),
          first()
        )
        .subscribe(count => this.ordersCount = count)
    );
    this.orders$ = this.store.pipe(
      select(ordersSelector),
      filter(orders => orders !== null)
    );
    this.subscription.add(this.orders$.subscribe(data => this.dataSource = new MatTableDataSource(data)));
    this.subscription.add(this.currentUser$.pipe(filter(currentUser => currentUser !== null)).subscribe(currentUser => this.disabled = currentUser.role === 'manager'));
    this.idCustomer = this.route.snapshot.params.id;
  }

  initializeForm(): void {
    this.form = new FormGroup({
      minAmount: new FormControl(null),
      maxAmount: new FormControl(null),
      assignedUserId: new FormControl(null),
      stage: new FormControl(),
      date: this.date
    })
  }

  initializeListeners(): void {
    this.subscription.add(
      this.route.queryParams
        .subscribe((params: Params) => {
          this.fetchOrders();
        })
    );
  }

  fetchOrders(): void {
    const offset = (this.paginator.pageIndex + 1) * this.paginator.pageSize - this.paginator.pageSize;
    const stringifiedParams = stringify({
      ...this.queryParams,
      customerId: this.idCustomer,
      limit: this.paginator.pageSize,
      offset
    });
    const apiUrlWithParams = `/orders?${stringifiedParams}`;
    this.store.dispatch(getOrdersAction({url: apiUrlWithParams}));
  }

  onSubmit(): void {
    this.queryParams = {};
    if (this.form.value.stage && this.form.value.stage.length > 0) {
      this.form.value.stage.map((key: string) => {
        this.queryParams[key] = true
      });
    }
    this.form.value.assignedUserId ? this.queryParams['assignedUserId'] = this.form.value.assignedUserId : false;
    this.form.value.minAmount ? this.queryParams['minAmount'] = this.form.value.minAmount : false;
    this.form.value.maxAmount ? this.queryParams['maxAmount'] = this.form.value.maxAmount : false;
    this.form.value.date.start ? this.queryParams['startDateEnd'] = this.datePipe.transform(this.form.value.date.start._d, 'yyyy-MM-dd') : false;
    this.form.value.date.end ? this.queryParams['endDateEnd'] = this.datePipe.transform(this.form.value.date.end._d, 'yyyy-MM-dd') : false;

    this.fetchOrders();
  }

  resetForm(): void {
    this.form.reset();
    this.queryParams = {};

    this.fetchOrders();
  }

  onRemove(_id: string): void {

  }

  // Проверяем значение минимальной стоимости при потере фокуса
  minCurrentValue(): void {
    const value = this.form.controls['minAmount'].value;
    const maxValue = this.form.controls['maxAmount'].value;

    if (value < 0) {
      this.form.controls['minAmount'].patchValue(maxValue ? 0 : null);
      return;
    }

    if (value > maxValue && maxValue && value) {
      this.form.controls['minAmount'].patchValue(maxValue);
    } else if (!value) {
      this.form.controls['minAmount'].patchValue(null);
    }
  }

  // Проверяем значение максимальной стоимости при потере фокуса
  maxCurrentValue(): void {
    const value = this.form.controls['maxAmount'].value;
    const minValue = this.form.controls['minAmount'].value;

    if (value < 0) {
      this.form.controls['maxAmount'].patchValue(minValue ? minValue : null);
      return;
    }

    if (value < minValue && minValue && value) {
      this.form.controls['maxAmount'].patchValue(minValue);
    } else if (!value) {
      this.form.controls['maxAmount'].patchValue(null);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
