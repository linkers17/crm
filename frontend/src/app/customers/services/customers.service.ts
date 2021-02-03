import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ContactsInterface} from "../../shared/modules/contacts/types/contacts.interface";
import {environment} from "../../../environments/environment";
import {CustomersResponseInterface} from "../types/customersResponse.interface";

@Injectable()
export class CustomersService {

  constructor(
    private http: HttpClient
  ) {
  }

  getCustomers(url: string): Observable<CustomersResponseInterface> {
    console.log('url', url);
    const currentUrl = environment.API_URL + url;
    console.log('currentUrl', currentUrl);
    return this.http.get<CustomersResponseInterface>(currentUrl);
  }

  getCustomer(id: string): Observable<any> {
    const url = `${environment.API_URL}/customers/${id}`;

    return this.http.get<ContactsInterface>(url);
  }

}
