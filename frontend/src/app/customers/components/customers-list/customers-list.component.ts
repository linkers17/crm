import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

export interface Customers {
  _id: string,
  surname: string,
  name: string,
  patronym: string,
  email: string,
  birthday: string,
  assignedUserId: string,
  assignedUserLogin: [{login: string}]
}

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Customers>; // Данные для таблицы
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

  constructor() { }

  // сортировка и пагинация таблицы
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('pagination', this.dataSource);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Customers>([
      {
        _id: "5fc5d69de443953368ebfe02",
        surname: "Сидоров",
        name: "Иван",
        patronym: "Иванович",
        birthday: "1993-12-05T17:00:00.000Z",
        email: "email9@email.com",
        assignedUserId: "5f97c367e890e82ac8c6003f",
        assignedUserLogin: [
          {
            "login": "superadmin"
          }
        ]
      },
      {
        _id: "5fc5d69de443953368ebfe02",
        surname: "Иванов",
        name: "Олег",
        patronym: "Николаевич",
        birthday: "1988-12-11T00:00:00.000Z",
        email: "email9@email.com",
        assignedUserId: "5f97c367e890e82ac8c6003f",
        assignedUserLogin: [
          {
            "login": "superadmin"
          }
        ]
      }
    ]);
  }

  onSubmit():void {

  }

  // Удаление клиента
  onRemove(_id: string): void {

  }
}
