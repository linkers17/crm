import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {GetOrderResponseInterface} from "../../types/getOrderResponse.interface";
import {select, Store} from "@ngrx/store";
import {currentOrderSelector, isLoadingOrdersSelector} from "../../store/selectors";
import {ActivatedRoute} from "@angular/router";
import {getOrderByIdAction} from "../../store/actions/getOrder.action";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  id: string;
  displayedColumns: string[] = ['num', 'title', 'quantity', 'amount'];

  // selectors
  currentOrder$: Observable<GetOrderResponseInterface | null>;
  isLoading$: Observable<boolean>;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeValues();
    this.store.dispatch(getOrderByIdAction({id: this.id}));
  }

  initializeValues(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isLoading$ = this.store.pipe(select(isLoadingOrdersSelector));
    this.currentOrder$ = this.store.pipe(select(currentOrderSelector));
  }

  onRemove(id: string): void {

  }

}
