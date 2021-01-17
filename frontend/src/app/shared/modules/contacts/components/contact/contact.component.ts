import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {getContactByIdAction} from "../../store/actions/getContact.action";
import {ContactsInterface} from "../../types/contacts.interface";
import {
  currentContactSelector,
  errorContactsSelector,
  isLoadingContactsSelector,
  successContactsSelector
} from "../../store/selectors";
import {filter, map} from "rxjs/operators";
import {environment} from "../../../../../../environments/environment";
import {ContactUpdateRequestInterface} from "../../types/contactUpdateRequest.interface";
import {updateContactAction} from "../../store/actions/updateContact.action";
import {BackendErrorsInterface} from "../../../../types/backendErrors.interface";
import {Location} from "@angular/common";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  @ViewChild('input') inputRef: ElementRef;

  currentContactSubscription: Subscription;
  currentContact: ContactsInterface;
  id: string;

  form: FormGroup;
  accept = 'image/jpeg, image/png, image/svg+xml, image/pjpeg';  // Доступные для загрузки форматы файлов
  image: File | null = null;  // Файл, для отправки на сервер
  imagePreview: string | ArrayBuffer;  // Отображение изображения в шаблоне
  apiUploads = `${environment.API_UPLOADS}/`;  // Путь к картинкам сервера
  isLoadImg = false;  // Флаг для блокировки кнопки удаления изображения

  // selectors
  isSubmitting$: Observable<boolean>;
  successMessages$: Observable<string | null>;
  errorMessages$: Observable<BackendErrorsInterface | string | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private location: Location
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
    const request: ContactUpdateRequestInterface = {
      ...this.form.value,
      img: this.image
    }
    this.store.dispatch(updateContactAction({id, request}));
  }

  initializeValues(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isSubmitting$ = this.store.pipe(select(isLoadingContactsSelector));
    this.successMessages$ = this.store.pipe(
      select(successContactsSelector),
      filter(message => message !== null),
      map(message => message.message)
    );
    this.errorMessages$ = this.store.pipe(select(errorContactsSelector));
  }

  initializeListeners(): void {
    this.currentContactSubscription = this.store.pipe(
      select(currentContactSelector),
      filter(currentContact => currentContact !== null))
      .subscribe((currentContact: ContactsInterface) => {
        this.currentContact = currentContact;
        this.imagePreview = `${this.apiUploads}${currentContact.img}`;
        this.initializeForm();
      });
  }

  initializeForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.currentContact.name, [
        Validators.required
      ]),
      removeImg: new FormControl(false)
    });
  }

  // Загрузка картинки
  triggerClick(): void {
    this.inputRef.nativeElement.click();
  }

  // Загрузка файла
  onFileUpload(e: any): void {
    const file = e.target.files[0];
    console.log('file', file);
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file);
    this.form.patchValue({
      removeImg: false
    });
    this.isLoadImg = false;
  }

  // Удаление картинки
  removeImg(): void {
    this.imagePreview = '';
    this.form.patchValue({
      removeImg: true
    });
    this.isLoadImg = true;
    this.image = null;
  }

  redirectToBack(): void {
    this.location.back();
  }
}
