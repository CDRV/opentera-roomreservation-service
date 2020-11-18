import {ErrorHandler, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptor} from './core/interceptors/token.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from './services/authentication.service';
import {LoginModule} from './pages/login/login.module';
import {ScheduleModule} from './pages/schedule/schedule.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {AppLayoutComponent} from './shared/layout/app-layout/app-layout.component';
import {LoginLayoutComponent} from './shared/layout/login-layout/login-layout.component';
import {RoomsModule} from './pages/rooms/rooms.module';
import {AppErrorHandler} from './core/interceptors/app-error-handler.injector';
import {ServerErrorInterceptor} from './core/interceptors/server-error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    LoginLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    LoginModule,
    ScheduleModule,
    RoomsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true},
    {provide: ErrorHandler, useClass: AppErrorHandler},
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
