import {NgModule} from '@angular/core';
import {Pages} from '@core/utils/pages';
import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from '@pages/not-found/not-found.component';
import {LoginComponent} from '@pages/login/login.component';
import {CalendarComponent} from '@pages/calendar/calendar.component';
import {AppLayoutComponent} from '@shared/layout/app-layout/app-layout.component';
import {LoginLayoutComponent} from '@shared/layout/login-layout/login-layout.component';
import {RoomsComponent} from '@pages/rooms/rooms.component';
import {AccountResolver} from '@services/resolvers/account.resolver';
import {AuthGuardService} from '@services/guards/auth-guard.service';
import {ReservationFormComponent} from '@components/forms/reservation-form/reservation-form.component';

const routes: Routes = [
  {path: '', redirectTo: Pages.calendarPage, pathMatch: 'full'},
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuardService],
    resolve: [AccountResolver],
    children: [
      {path: Pages.roomsPage, component: RoomsComponent},
      {path: Pages.calendarPage, component: CalendarComponent},
      {path: Pages.fourofourPage, component: NotFoundComponent},
      {path: Pages.reservationFormPage, component: ReservationFormComponent},
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {path: Pages.loginPage, component: LoginComponent}
    ]
  },
  {path: '**', redirectTo: Pages.fourofourPage}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false
    })
  ],
  providers: [AuthGuardService],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
