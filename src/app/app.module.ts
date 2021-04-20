import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptor} from '@core/interceptors/token.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from '@services/authentication.service';
import {LoginModule} from '@pages/login/login.module';
import {AppLayoutComponent} from '@shared/layout/app-layout/app-layout.component';
import {LoginLayoutComponent} from '@shared/layout/login-layout/login-layout.component';
import {RoomsModule} from '@pages/rooms/rooms.module';
import {AppErrorHandler} from '@core/interceptors/app-error-handler.injector';
import {ServerErrorInterceptor} from '@core/interceptors/server-error.interceptor';
import {AppMaterialModule} from '@shared/app-material.module';
import localeFr from '@angular/common/locales/fr';
import {HeaderComponent} from '@components/navigation/header/header.component';
import {NavigationComponent} from '@components/navigation/navigation/navigation.component';
import {ProfileComponent} from '@components/navigation/profile/profile.component';
import {MenuHamburgerComponent} from '@components/navigation/menu-hamburger/menu-hamburger.component';
import {ResponsiveNavigationComponent} from '@components/navigation/responsive-navigation/responsive-navigation.component';
import {FooterComponent} from '@components/footer/footer.component';
import {SharedModule} from '@shared/shared.module';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    LoginLayoutComponent,
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    ProfileComponent,
    MenuHamburgerComponent,
    ResponsiveNavigationComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    LoginModule,
    RoomsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true},
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: LOCALE_ID, useValue: 'FR-fr'},
    AuthenticationService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
