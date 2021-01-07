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

    return this.http.post<RegisterResponseInterface>(url, data);
  }
}
