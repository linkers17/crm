import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {UpdateOrderRequestInterface} from "../types/updateOrderRequest.interface";

@Injectable()
export class OrdersServices {

  constructor(
    private http: HttpClient
  ) {
  }

  API_UPLOADS = environment.API_UPLOADS;
  API_URL = environment.API_URL;

  generateAgreement(data: UpdateOrderRequestInterface): Observable<any> {
    const url = `${this.API_URL}/generate/agreement`
    return this.http.post<any>(url, data);
  }

}
