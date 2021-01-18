import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {BackendErrorsInterface} from "../../../../types/backendErrors.interface";
import {select, Store} from "@ngrx/store";
import {errorContactsSelector, successContactsSelector} from "../../store/selectors";
import {BackendMessagesInterface} from "../../../../types/backendMessages.interface";

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {

  // selectors
  successMessages$: Observable<BackendMessagesInterface | null>;
  errorMessages$: Observable<BackendErrorsInterface | null>;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues(): void {
    this.successMessages$ = this.store.pipe(
      select(successContactsSelector)
    );
    this.errorMessages$ = this.store.pipe(select(errorContactsSelector));
  }

}
