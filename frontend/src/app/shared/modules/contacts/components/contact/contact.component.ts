import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {getContactByIdAction} from "../../store/actions/getContact.action";
import {ContactsInterface} from "../../types/contacts.interface";
import {currentContactSelector} from "../../store/selectors";
import {filter} from "rxjs/operators";
import {environment} from "../../../../../../environments/environment";

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

  constructor(
    private store: Store,
    private route: ActivatedRoute
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
    console.log('img', this.image);
    console.log('form', this.form.value);
  }

  initializeValues(): void {
    this.id = this.route.snapshot.paramMap.get('id');
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
}
