import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CustomersInterface} from "../../types/customers.interface";
import {merge, Observable, Subscription} from "rxjs";
import {CurrentUserInterface} from "../../../shared/types/currentUser.interface";
import {select, Store} from "@ngrx/store";
import {currentUserSelector} from "../../../auth/store/selectors";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {parseUrl, stringify} from "query-string";
import {getCustomersAction} from "../../store/actions/getCustomers.action";
import {filter, tap} from "rxjs/operators";
import {countCustomersSelector, customersSelector} from "../../store/selectors";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {removeCustomerAction} from "../../store/actions/removeCustomer.action";

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, AfterViewInit, OnDestroy {

  baseUrl: string;
  dataSource: MatTableDataSource<CustomersInterface>; // Данные для таблицы
  displayedColumns: string[] = [
    'surname',
    'name',
    'patronym',
    'email',
    'birthday',
    'assignedUserLogin',
    'view',
    'remove'
  ]; // Столбцы таблицы

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  disabled: boolean;        // Флаг для блокировки селектора с выбором менеджера

  // selectors
  currentUser$: Observable<CurrentUserInterface | null>;
  customers$: Observable<CustomersInterface[] | null>;
  isLoading$: Observable<boolean | null>;
  countCustomers$: Observable<number | null>;

  subscription: Subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
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
    this.initializeValies();
    this.initializeForm();
  }

  initializeValies(): void {
    this.currentUser$ = this.store.pipe(select(currentUserSelector));
    this.countCustomers$ = this.store.pipe(select(countCustomersSelector));
    this.customers$ = this.store.pipe(
      select(customersSelector),
      filter(customers => customers !== null)
    );
    this.subscription.add(this.customers$.subscribe(data => this.dataSource = new MatTableDataSource(data)));
    this.subscription.add(this.currentUser$.subscribe(currentUser => this.disabled = currentUser.role === 'manager'));
    this.baseUrl = this.router.url.split('?')[0].replace('/dashboard', '');
  }

  initializeListeners(): void {
    this.subscription.add(
      this.route.queryParams
        .subscribe((params: Params) => {
          this.fetchCustomers(params);
        })
    );
  }

  initializeForm(): void {
    this.subscription.add(
      this.route.queryParams
        .subscribe((params: Params) => {
          this.form = new FormGroup({
            surname: new FormControl(params.surname ? params.surname : null),
            email: new FormControl(params.email ? params.email : null, [
              Validators.email
            ]),
            birthday: new FormControl(params.birthday ? params.birthday : null),
            assignedUserId: new FormControl({
              value: params.assignedUserId ? params.assignedUserId : null,
              disabled: this.disabled
            })
          });
        })
    );
  }

  // Получаем клиентов
  fetchCustomers(queryParams: Object): void {
    const offset = (this.paginator.pageIndex + 1) * this.paginator.pageSize - this.paginator.pageSize;
    const parsedUrl = parseUrl(this.baseUrl);
    const stringifiedParams = stringify({
      ...queryParams,
      limit: this.paginator.pageSize,
      offset
    });
    const apiUrlWithParams = `${parsedUrl.url}?${stringifiedParams}`;
    this.store.dispatch(getCustomersAction({url: apiUrlWithParams}));
  }

  onSubmit():void {
    const queryParams = this.form.value;
    Object.keys(queryParams).forEach((key) => (queryParams[key] == false) && delete queryParams[key]);
    this.router.navigate([`/dashboard`, 'customers'], {
      queryParams
    });
  }

  resetForm(): void  {
    this.form.reset();
    this.router.navigate([`/dashboard`, 'customers']);
  }

  // Удаление клиента
  onRemove(id: string): void {
    this.store.dispatch(removeCustomerAction({id, redirect: false}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
