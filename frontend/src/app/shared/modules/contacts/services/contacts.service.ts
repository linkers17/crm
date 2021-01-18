import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ContactsInterface} from "../types/contacts.interface";
import {environment} from "../../../../../environments/environment";
import {ContactRequestInterface} from "../types/contactRequest.interface";
import {BackendMessagesInterface} from "../../../types/backendMessages.interface";
import {ContactUpdateRequestInterface} from "../types/contactUpdateRequest.interface";

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

  getContact(id: string): Observable<ContactsInterface> {
    const url = `${environment.API_URL}/contacts/${id}`;

    return this.http.get<ContactsInterface>(url);
  }

  createContact(data: ContactRequestInterface): Observable<ContactsInterface> {
    const url = `${environment.API_URL}/contacts`;
    const formData: any = new FormData();

    formData.append('name', data.name);
    if (data.img) {
      formData.append('img', data.img);
    }

    return this.http.post<ContactsInterface>(url, formData);
  }

  updateContact(id: string, data: ContactUpdateRequestInterface): Observable<ContactsInterface> {
    const url = `${environment.API_URL}/contacts/${id}`;
    const formData: any = new FormData();

    formData.append('name', data.name);
    formData.append('removeImg', data.removeImg.toString());
    if (data.img) {
      formData.append('img', data.img);
    }

    return this.http.patch<ContactsInterface>(url, formData);
  }

  removeContact(id: string): Observable<BackendMessagesInterface> {
    const url = `${environment.API_URL}/contacts/${id}`;

    return this.http.delete<BackendMessagesInterface>(url);
  }
}
