import {LOCALE_ID, NgModule, Optional, SkipSelf} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ServerErrorInterceptor} from '@core/interceptors/server-error.interceptor';
import {AuthenticationService} from '@services/authentication.service';
import {TokenInterceptor} from '@core/interceptors/token.interceptor';
import {LoginButtonService} from '@services/login-button.service';
import {NotificationService} from '@services/notification.service';
import {ProjectService} from '@services/project.service';
import {SelectedSiteService} from '@services/selected-site.service';
import {SessionTypeService} from '@services/session-type.service';
import {ShowResponsiveNavigationService} from '@services/show-responsive-navigation.service';
import {UserService} from '@services/user.service';
import {ParticipantService} from '@services/participant.service';
import {ReservationService} from '@services/reservation.service';
import {RoomService} from '@services/room.service';
import {SelectedRoomService} from '@services/selected-room.service';
import {SiteService} from '@services/site.service';
import {AccountService} from '@services/account.service';
import {PermissionsService} from '@services/permissions.service';
import {AccountResolver} from '@services/resolvers/account.resolver';
import {AuthGuardService} from '@services/guards/auth-guard.service';
import {ShowCalendarInstructionsService} from '@services/show-calendar-instructions.service';
import {SelectedProjectService} from '@services/selected-project.service';
import {NGX_MAT_DATE_FORMATS, NgxMatDateFormats} from '@angular-material-components/datetime-picker';

const INTL_DATE_INPUT_FORMAT = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
};

const MAT_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: INTL_DATE_INPUT_FORMAT,
  },
  display: {
    dateInput: INTL_DATE_INPUT_FORMAT,
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@NgModule({
  providers: [
    AccountResolver,
    AuthGuardService,
    AuthenticationService,
    AccountService,
    AuthenticationService,
    LoginButtonService,
    NotificationService,
    ParticipantService,
    PermissionsService,
    ProjectService,
    ReservationService,
    RoomService,
    SelectedRoomService,
    SelectedProjectService,
    SelectedSiteService,
    SessionTypeService,
    ShowResponsiveNavigationService,
    ShowCalendarInstructionsService,
    SiteService,
    UserService,
    AccountService,
    {provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'FR-fr'},
    {provide: NGX_MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS}
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
