import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {OrdersInterface} from "../../types/orders.interface";
import {environment} from "../../../../environments/environment";
import * as _moment from "moment";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {merge, Observable, Subscription} from "rxjs";
import {CurrentUserInterface} from "../../../shared/types/currentUser.interface";
import {select, Store} from "@ngrx/store";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {filter, tap} from "rxjs/operators";
import {currentUserSelector} from "../../../auth/store/selectors";
import {countOrdersSelector, isLoadingOrdersSelector, ordersSelector} from "../../store/selectors";
import {parseUrl, stringify} from "query-string";
import {getOrdersAction} from "../../store/actions/getOrders.action";

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
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
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
export class OrdersListComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FormGroup;
  baseUrl: string;
  disabled: boolean;
  queryParams: any = {};

  date = new FormGroup({
    start: new FormControl(this.route.snapshot.queryParams.startDateEnd ? this.route.snapshot.queryParams.startDateEnd : null),
    end: new FormControl(this.route.snapshot.queryParams.endDateEnd ? this.route.snapshot.queryParams.endDateEnd : null)
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Временные значения стадий заказа
  stagesList = environment.STAGES;

  // selectors
  orders$: Observable<OrdersInterface[] | null>;
  currentUser$: Observable<CurrentUserInterface | null>;
  isLoading$: Observable<boolean | null>;
  countOrders$: Observable<number | null>;

  subscription: Subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngAfterViewInit(): void {

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
    setTimeout(() => this.initializeListeners());
    this.initializeValues();
    this.initializeForm();
  }

  initializeValues(): void {
    this.isLoading$ = this.store.pipe(select(isLoadingOrdersSelector));
    this.currentUser$ = this.store.pipe(select(currentUserSelector));
    this.countOrders$ = this.store.pipe(select(countOrdersSelector));
    this.orders$ = this.store.pipe(
      select(ordersSelector),
      filter(orders => orders !== null)
    );
    this.subscription.add(this.orders$.subscribe(data => this.dataSource = new MatTableDataSource(data)));
    this.subscription.add(this.currentUser$.pipe(filter(currentUser => currentUser !== null)).subscribe(currentUser => this.disabled = currentUser.role === 'manager'));
    this.baseUrl = this.router.url.split('?')[0].replace('/dashboard', '');
  }

  initializeForm(): void {

    this.subscription.add(
      this.route.queryParams
        .subscribe((params: Params) => {

          // Вычисляем стадии сделок для инициализации списка выбора
          const stageChecked: string[] = [];
          params.prospecting ? stageChecked.push('prospecting') : false;
          params.offer ? stageChecked.push('offer') : false;
          params.negotiation ? stageChecked.push('negotiation') : false;
          params['closed won'] ? stageChecked.push('closed won') : false;
          params['closed loose'] ? stageChecked.push('closed loose') : false;

          this.form = new FormGroup({
            minAmount: new FormControl(params.minAmount ? params.minAmount : null),
            maxAmount: new FormControl(params.maxAmount ? params.maxAmount : null),
            assignedUserId: new FormControl({
              value: params.assignedUserId ? params.assignedUserId : null,
              disabled: this.disabled
            }),
            stage: new FormControl(stageChecked),
            date: this.date
          });
        })
    );
  }

  initializeListeners(): void {
    this.subscription.add(
      this.route.queryParams
        .subscribe((params: Params) => {
          this.fetchOrders(params);
        })
    );
  }

  fetchOrders(queryParams: Object): void {
    const offset = (this.paginator.pageIndex + 1) * this.paginator.pageSize - this.paginator.pageSize;
    const sortActive = this.sort.active;
    const sortDirection = this.sort.direction ? this.sort.direction : undefined;
    const parsedUrl = parseUrl(this.baseUrl);
    const stringifiedParams = stringify({
      ...queryParams,
      limit: this.paginator.pageSize,
      offset,
      sortActive,
      sortDirection
    });
    const apiUrlWithParams = `${parsedUrl.url}?${stringifiedParams}`;
    this.store.dispatch(getOrdersAction({url: apiUrlWithParams}));
  }

  onSubmit(): void {
    const formValues = this.form.value;
    if (formValues.stage && formValues.stage.length > 0) {
      formValues.stage.map((key: string) => {
        this.queryParams[key] = true
      });
    }
    formValues.assignedUserId ? this.queryParams['assignedUserId'] = formValues.assignedUserId : false;
    formValues.minAmount ? this.queryParams['minAmount'] = formValues.minAmount : false;
    formValues.maxAmount ? this.queryParams['maxAmount'] = formValues.maxAmount : false;
    formValues.date.start ? this.queryParams['startDateEnd'] = this.datePipe.transform(formValues.date.start._d, 'yyyy-MM-dd') : false;
    formValues.date.end ? this.queryParams['endDateEnd'] = this.datePipe.transform(formValues.date.end._d, 'yyyy-MM-dd') : false;

    this.router.navigate([`/dashboard`, 'orders'], {
      queryParams: this.queryParams
    });
  }

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

  resetForm(): void {
    this.form.reset();
    this.queryParams = {};
    this.router.navigate([`/dashboard`, 'orders']);
  }


  onRemove(_id: string): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
