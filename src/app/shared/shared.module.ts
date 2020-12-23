import {NgModule} from '@angular/core';
import {CalendarComponent} from '../components/calendar/calendar.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FlatpickrModule} from 'angularx-flatpickr';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {SiteSelectionComponent} from '../components/site-selection/site-selection.component';
import {RoomSelectionComponent} from '../components/room-selection/room-selection.component';
import {ConfirmationDialogComponent} from '../components/confirmation-dialog/confirmation-dialog.component';
import {RoomFormDialogComponent} from '../components/room-form-dialog/room-form-dialog.component';
import {ReservationFormDialogComponent} from '../components/reservation-form-dialog/reservation-form-dialog.component';
import {ParticipantSelectionComponent} from '../components/participant-selection/participant-selection.component';
import {AppMaterialModule} from './app-material.module';
import {LogoComponent} from '../components/logo/logo.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from '@danielmoncada/angular-datetime-picker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AppMaterialModule,
    AngularSvgIconModule.forRoot()
  ],
  declarations: [
    CalendarComponent,
    SiteSelectionComponent,
    RoomSelectionComponent,
    ParticipantSelectionComponent,
    ConfirmationDialogComponent,
    RoomFormDialogComponent,
    ReservationFormDialogComponent,
    LogoComponent
  ],
  exports: [
    CalendarComponent,
    SiteSelectionComponent,
    RoomSelectionComponent,
    ParticipantSelectionComponent,
    AppMaterialModule,
    LogoComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    RoomFormDialogComponent,
    ReservationFormDialogComponent
  ]
})
export class SharedModule {
}
