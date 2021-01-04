import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  links = [
    {title: 'Вход', nav: 'login'},
    {title: 'Регистрация', nav: 'register'}
  ];
  activeLink: string = this.router.url.slice(1);

  ngOnInit(): void {
  }

}
