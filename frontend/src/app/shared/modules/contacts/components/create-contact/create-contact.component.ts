import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {isLoadingContactsSelector} from "../../store/selectors";
import {Location} from "@angular/common";
import {ContactRequestInterface} from "../../types/contactRequest.interface";
import {createContactAction} from "../../store/actions/createContact.action";

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;

  form: FormGroup;
  accept = 'image/jpeg, image/png, image/svg+xml, image/pjpeg';  // Доступные для загрузки форматы файлов
  image: File | null = null;
  imagePreview: string | ArrayBuffer;
  isLoadImg = true;

  // selectors
  isSubmitting$: Observable<boolean>;

  constructor(
    private store: Store,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.initializeValues();
    this.initializeForm();
  }

  initializeValues(): void {
    this.isSubmitting$ = this.store.pipe(select(isLoadingContactsSelector));
  }

  initializeForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required
      ])
    });
  }

  onSubmit(): void {
    const request: ContactRequestInterface = {
      ...this.form.value,
      img: this.image
    }
    this.store.dispatch(createContactAction({request}));
  }

  // Загрузка картинки
  triggerClick(): void {
    this.inputRef.nativeElement.click();
  }

  // Загрузка файла
  onFileUpload(e: any): void {
    const file = e.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file);
    this.isLoadImg = false;
  }

  // Удаление картинки
  removeImg(): void {
    this.imagePreview = '';
    this.isLoadImg = true;
    this.image = null;
  }

  redirectToBack(): void {
    this.location.back();
  }

}
