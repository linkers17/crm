import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  accept = '.png, .jpg, .jpeg';
  hide = true;
  phones = [{id: 1, input: ''}];

  constructor() { }

  ngOnInit(): void { }

  addPhone(): void {
    this.phones = this.phones.filter(phoneInput => phoneInput.input.trim() !== '');
    this.phones.push({id: this.phones[this.phones.length - 1].id + 1, input: ''});
  }

  removePhone(id: number): void {
    this.phones = this.phones.filter(phoneInput => phoneInput.id !== id);
  }

}
