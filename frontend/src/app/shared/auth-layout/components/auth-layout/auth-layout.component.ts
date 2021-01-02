import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

  constructor() { }

  links = [
    {title: 'Вход', nav: 'login'},
    {title: 'Регистрация', nav: 'register'}
  ];
  activeLink = this.links[0].title;

  ngOnInit(): void {
  }

}
