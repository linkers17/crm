import { Injectable } from '@angular/core';
import {RegisterRequestInterface} from "../types/registerRequest.interface";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RegisterResponseInterface} from "../types/registerResponse.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  register(data: RegisterRequestInterface): Observable<RegisterResponseInterface> {
    const url = `${environment.API_URL}/auth/register`;

    const formData: any = new FormData();
    Object.keys(data).map(field => {
      if (field !== 'userImg' && field !== 'phones' && field !== 'contacts') {
        formData.append(field, data[field]);
      }
    });
    data.phones.map(phone => {
      formData.append('phones', phone);
    });
    data.userImg ?
      formData.append('userImg', data.userImg, data.userImg.name) :
      formData.append('userImg', null);

    return this.http.post<RegisterResponseInterface>(url, formData);
  }
}
