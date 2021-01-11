import { Component, OnInit } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {CurrentUserInterface} from "../../../types/currentUser.interface";
import {currentUserSelector} from "../../../../auth/store/selectors";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {

  apiUploads = `${environment.API_UPLOADS}/`;

  //selectors
  currentUser$: Observable<CurrentUserInterface | null>;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.store.pipe(select(currentUserSelector));
  }

}
