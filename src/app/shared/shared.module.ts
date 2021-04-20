import {NgModule} from '@angular/core';
import {ScheduleComponent} from '@pages/schedule/schedule.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlatpickrModule} from 'angularx-flatpickr';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {SiteSelectionComponent} from '@components/site-selection/site-selection.component';
import {RoomSelectionComponent} from '@components/room-selection/room-selection.component';
import {ConfirmationDialogComponent} from '@components/confirmation-dialog/confirmation-dialog.component';
import {RoomFormDialogComponent} from '@components/room-form-dialog/room-form-dialog.component';
import {ReservationFormDialogComponent} from '@components/reservation-form-dialog/reservation-form-dialog.component';
import {ParticipantSelectionComponent} from '@components/participant-selection/participant-selection.component';
import {AppMaterialModule} from './app-material.module';
import {
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeIntl,
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import {DefaultIntl} from '@core/utils/datetime-picker.config';
import {ProjectSelectionComponent} from '@components/project-selection/project-selection.component';
import {SessionTypeSelectionComponent} from '@components/session-type-selection/session-type-selection.component';
import {UserSelectionComponent} from '@components/user-selection/user-selection.component';
import {ScheduleInstructionsComponent} from '@components/schedule-instructions/schedule-instructions.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {LogoComponent} from '@components/logo/logo.component';
import {SpinnerComponent} from '@components/spinner/spinner.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularSvgIconModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AppMaterialModule,
  ],
  declarations: [
    LogoComponent,
    ScheduleComponent,
    SiteSelectionComponent,
    RoomSelectionComponent,
    ProjectSelectionComponent,
    ParticipantSelectionComponent,
    UserSelectionComponent,
    SessionTypeSelectionComponent,
    ConfirmationDialogComponent,
    RoomFormDialogComponent,
    ReservationFormDialogComponent,
    ScheduleInstructionsComponent,
    SpinnerComponent
  ],
  exports: [
    ScheduleComponent,
    SiteSelectionComponent,
    RoomSelectionComponent,
    ProjectSelectionComponent,
    UserSelectionComponent,
    SessionTypeSelectionComponent,
    ParticipantSelectionComponent,
    AppMaterialModule,
    LogoComponent

  ],
  entryComponents: [
    ConfirmationDialogComponent,
    RoomFormDialogComponent,
    ReservationFormDialogComponent
  ],
  providers: [
    {provide: OwlDateTimeIntl, useClass: DefaultIntl},
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},
  ]
})
export class SharedModule {
}
