import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {getContactByIdAction} from "../../store/actions/getContact.action";
import {ContactsInterface} from "../../types/contacts.interface";
import {currentContactSelector} from "../../store/selectors";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  form: FormGroup;
  id: string;
  currentContactSubscription: Subscription;
  currentContact: ContactsInterface;

  // selectors
  isSubmitting$: Observable<boolean>;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeListeners();
    this.initializeValues();
    this.store.dispatch(getContactByIdAction({id: this.id}));
  }

  ngOnDestroy(): void {
    this.currentContactSubscription.unsubscribe();
  }

  onSubmit(id: string): void {

  }

  initializeValues(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  initializeListeners(): void {
    this.currentContactSubscription = this.store.pipe(
      select(currentContactSelector),
      filter(currentContact => currentContact !== null))
      .subscribe((currentContact: ContactsInterface) => {
        this.currentContact = currentContact
        this.initializeForm();
      });
  }

  initializeForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.currentContact.name, [
        Validators.required
      ])
    });
  }
}
