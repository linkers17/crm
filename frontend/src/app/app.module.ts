import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthModule} from "./auth/auth.module";
import {AuthLayoutModule} from "./shared/auth-layout/auth-layout.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // Layouts Modules
    AuthLayoutModule,
    // /Layouts Modules

    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
