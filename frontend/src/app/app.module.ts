import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthModule} from "./auth/auth.module";
import {AuthLayoutModule} from "./shared/auth-layout/auth-layout.module";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {EffectsModule} from "@ngrx/effects";
import {PersistanceService} from "./shared/services/persistance.service";
import {TokenInterceptor} from "./shared/services/token.interceptor";
import {SiteLayoutModule} from "./shared/site-layout/site-layout.module";
import {reducer} from "./shared/store/reducers";
import {StoreRouterConnectingModule} from "@ngrx/router-store";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    StoreRouterConnectingModule.forRoot(),
    HttpClientModule,

    // Layouts Modules
    AuthLayoutModule,
    SiteLayoutModule,
    // */ Layouts Modules

    // Pages Modules
    AuthModule
    // */ Pages Modules
  ],
  providers: [
    PersistanceService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
