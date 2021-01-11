import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ContactsInterface} from "../types/contacts.interface";
import {environment} from "../../../../../environments/environment";

@Injectable()
export class ContactsService {

  constructor(
    private http: HttpClient
  ) {
  }

  getContacts(): Observable<ContactsInterface[]> {
    const url = `${environment.API_URL}/contacts`;

    return this.http.get<ContactsInterface[]>(url);
  }
}
