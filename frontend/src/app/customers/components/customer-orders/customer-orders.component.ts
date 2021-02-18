import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import * as _moment from 'moment';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

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
export class CustomerOrdersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;

  // Потом перенести в форму
  date = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  //

  // ТАБЛИЦА
  displayedColumns: string[] = [
    'title',
    'stage',
    'createdAt',
    'amount',
    'dateEnd',
    'createdByLogin',
    'view',
    'remove'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([
    {
      stage: 'offer',
      dateEnd: null,
      title: 'Тест заказ',
      amount: 150000,
      createdById: '5fa43fb7b0bf8d24481e1d0f',
      createdByLogin: 'nikolaeva',
      createdAt: '2020-12-15T11:33:23.324Z',
      _id: '5fdb42030ba68343e8e8b19a'
    },
    {
      stage: 'closed won',
      dateEnd: '2020-12-17T11:35:48.515Z',
      _id: '5fdb42940ba68343e8e8b19e',
      title: 'Тест заказ 4',
      amount: 22000,
      createdById: '5fa43fb7b0bf8d24481e1d0f',
      createdByLogin: 'nikolaeva',
      createdAt: '2020-12-16T11:35:48.524Z'
    },
    {
      stage: 'closed won',
      dateEnd: '2020-12-22T09:44:12.416Z',
      _id: '5fdb42e00ba68343e8e8b1a0',
      title: 'Тест заказ 5',
      amount: 51800,
      createdById: '5fa43fb7b0bf8d24481e1d0f',
      createdByLogin: 'nikolaeva',
      createdAt: '2020-12-18T11:37:04.922Z'
    },
    {
      stage: 'prospecting',
      dateEnd: null,
      _id: '5fdb4d626c8b4c45487c858b',
      title: 'Тест заказ 6',
      amount: 53300,
      createdById: '5f982c84a87f830668df9bbe',
      createdByLogin: 'nikolaeva',
      createdAt: '2021-01-14T12:21:54.832Z'
    }
  ]);
  // Столбцы таблицы

  // Временные значения стадий заказа
  stagesList = [
    {title: 'Привлечение клиента', value: 'prospecting'},
    {title: 'Предложение', value: 'offer'},
    {title: 'Согласование', value: 'negotiation'},
    {title: 'Закрыто успешно', value: 'closed won'},
    {title: 'Закрыто провалом', value: 'closed loose'}];

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = new FormGroup({
      amount: new FormControl(null),
      assignedUserId: new FormControl(null),
      stage: new FormControl()
    })
  }

  onSubmit(): void {

  }

  resetForm(): void {
    this.form.reset();
  }

  onRemove(_id: string): void {

  }
}
