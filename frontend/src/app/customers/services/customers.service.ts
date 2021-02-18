import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CustomersResponseInterface} from "../types/customersResponse.interface";
import {GetCustomerResponseInterface} from "../types/getCustomerResponse.interface";
import {BackendMessagesInterface} from "../../shared/types/backendMessages.interface";
import {UpdateCustomerRequestInterface} from "../types/updateCustomerRequest.interface";
import {UpdateCustomerResponseInterface} from "../types/updateCustomerResponse.interface";

@Injectable()
export class CustomersService {

  constructor(
    private http: HttpClient
  ) {
  }

  getCustomers(url: string): Observable<CustomersResponseInterface> {
    const currentUrl = environment.API_URL + url;
    return this.http.get<CustomersResponseInterface>(currentUrl);
  }

  getCustomer(id: string): Observable<GetCustomerResponseInterface> {
    const url = `${environment.API_URL}/customers/${id}`;
    return this.http.get<GetCustomerResponseInterface>(url);
  }

  createCustomer(data: UpdateCustomerRequestInterface): Observable<UpdateCustomerResponseInterface> {
    const url = `${environment.API_URL}/customers`;
    return this.http.post<UpdateCustomerResponseInterface>(url, data);
  }

  updateCustomer(id: string, data: UpdateCustomerRequestInterface): Observable<UpdateCustomerResponseInterface> {
    const url = `${environment.API_URL}/customers/${id}`;
    return this.http.patch<UpdateCustomerResponseInterface>(url, data);
  }

  removeCustomer(id: string): Observable<BackendMessagesInterface> {
    const url = `${environment.API_URL}/customers/${id}`;

    return this.http.delete<BackendMessagesInterface>(url);
  }

}
