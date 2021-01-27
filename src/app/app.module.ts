import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptor} from './core/interceptors/token.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from './services/authentication.service';
import {LoginModule} from './pages/login/login.module';
import {ScheduleModule} from './pages/schedule/schedule.module';
import {AppLayoutComponent} from './shared/layout/app-layout/app-layout.component';
import {LoginLayoutComponent} from './shared/layout/login-layout/login-layout.component';
import {RoomsModule} from './pages/rooms/rooms.module';
import {AppErrorHandler} from './core/interceptors/app-error-handler.injector';
import {ServerErrorInterceptor} from './core/interceptors/server-error.interceptor';
import {AppMaterialModule} from './shared/app-material.module';
import localeFr from '@angular/common/locales/fr';
import {LogoModule} from './components/logo/logo.module';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    LoginLayoutComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    LoginModule,
    ScheduleModule,
    RoomsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    LogoModule,
    AppRoutingModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true},
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: LOCALE_ID, useValue: 'FR-fr'},
    AuthenticationService
  ],
    exports: [
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
