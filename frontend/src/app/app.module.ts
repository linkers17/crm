import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthModule} from "./auth/auth.module";
import {AuthLayoutModule} from "./shared/auth-layout/auth-layout.module";
import {StoreModule} from "@ngrx/store";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}),

    // Layouts Modules
    AuthLayoutModule,
    // */ Layouts Modules

    // Pages Modules
    AuthModule
    // */ Pages Modules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
