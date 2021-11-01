import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppLayoutComponent} from '@shared/layout/app-layout/app-layout.component';
import {LoginLayoutComponent} from '@shared/layout/login-layout/login-layout.component';
import localeFr from '@angular/common/locales/fr';
import {HeaderComponent} from '@components/header/header/header.component';
import {NavigationComponent} from '@components/header/navigation/navigation.component';
import {ProfileComponent} from '@components/header/profile/profile.component';
import {MenuHamburgerComponent} from '@components/header/menu-hamburger/menu-hamburger.component';
import {ResponsiveNavigationComponent} from '@components/header/responsive-navigation/responsive-navigation.component';
import {FooterComponent} from '@components/footer/footer.component';
import {SharedModule} from '@shared/shared.module';
import {LoginComponent} from '@pages/login/login.component';
import {NotFoundComponent} from '@pages/not-found/not-found.component';
import {CoreModule} from '@core/core.module';
import {ReservationFormComponent} from '@components/forms/reservation-form/reservation-form.component';
import {RoomsComponent} from '@pages/rooms/rooms.component';
import {SelectedParticipantsComponent} from '@components/selected-participants/selected-participants.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    LoginLayoutComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    ProfileComponent,
    MenuHamburgerComponent,
    ResponsiveNavigationComponent,
    NotFoundComponent,
    ReservationFormComponent,
    RoomsComponent,
    SelectedParticipantsComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
