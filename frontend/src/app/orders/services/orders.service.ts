import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {OrdersResponseInterface} from "../types/ordersResponse.interface";

@Injectable()
export class OrdersService {

  constructor(
    private http: HttpClient
  ) {
  }

  getOrders(url: string): Observable<OrdersResponseInterface> {
    const currentUrl = environment.API_URL + url;
    return this.http.get<OrdersResponseInterface>(currentUrl);
  }

  /*getOrder(id: string): Observable<GetOrderResponseInterface> {
    const url = `${environment.API_URL}/orders/${id}`;
    return this.http.get<GetOrderResponseInterface>(url);
  }

  createOrder(data: UpdateOrderRequestInterface): Observable<UpdateOrderResponseInterface> {
    const url = `${environment.API_URL}/orders`;
    return this.http.post<UpdateOrderResponseInterface>(url, data);
  }

  updateOrder(id: string, data: UpdateOrderRequestInterface): Observable<UpdateOrderResponseInterface> {
    const url = `${environment.API_URL}/orders/${id}`;
    return this.http.patch<UpdateOrderResponseInterface>(url, data);
  }

  removeOrder(id: string): Observable<BackendMessagesInterface> {
    const url = `${environment.API_URL}/orders/${id}`;

    return this.http.delete<BackendMessagesInterface>(url);
  }*/
}
