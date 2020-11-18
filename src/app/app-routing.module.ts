import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {AuthGuardService} from './services/authentication.service';
import {ScheduleComponent} from './pages/schedule/schedule.component';
import {AppLayoutComponent} from './shared/layout/app-layout/app-layout.component';
import {LoginLayoutComponent} from './shared/layout/login-layout/login-layout.component';
import {RoomsComponent} from './pages/rooms/rooms.component';


const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: ScheduleComponent
      },
      {
        path: 'rooms',
        component: RoomsComponent
      },
      {
        path: 'schedule',
        component: ScheduleComponent
      }
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
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
