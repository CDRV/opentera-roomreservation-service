import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {SiteSelectorComponent} from '@components/selectors/site-selector/site-selector.component';
import {RoomSelectorComponent} from '@components/selectors/room-selector/room-selector.component';
import {ConfirmationDialogComponent} from '@components/confirmation-dialog/confirmation-dialog.component';
import {RoomFormDialogComponent} from '@components/forms/room-form-dialog/room-form-dialog.component';
import {ParticipantSelectorComponent} from '@components/selectors/participant-selector/participant-selector.component';
import {MaterialModule} from './material.module';
import {ProjectSelectorComponent} from '@components/selectors/project-selector/project-selector.component';
import {SessionTypeSelectorComponent} from '@components/selectors/session-type-selector/session-type-selector.component';
import {UserSelectorComponent} from '@components/selectors/user-selector/user-selector.component';
import {CalendarInstructionsComponent} from '@components/calendar-instructions/calendar-instructions.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {LogoComponent} from '@components/logo/logo.component';
import {SpinnerComponent} from '@components/spinner/spinner.component';
import {RouterModule} from '@angular/router';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from '@angular-material-components/datetime-picker';
import {DatetimeSelectorComponent} from '@components/selectors/datetime-selector/datetime-selector.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CalendarComponent} from '@pages/calendar/calendar.component';


@NgModule({
  declarations: [
    LogoComponent,
    SiteSelectorComponent,
    RoomSelectorComponent,
    ProjectSelectorComponent,
    ParticipantSelectorComponent,
    UserSelectorComponent,
    SessionTypeSelectorComponent,
    ConfirmationDialogComponent,
    RoomFormDialogComponent,
    CalendarInstructionsComponent,
    SpinnerComponent,
    DatetimeSelectorComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    AngularSvgIconModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    MaterialModule,
    AngularSvgIconModule,
    SpinnerComponent,
    LogoComponent,
    SiteSelectorComponent,
    RoomSelectorComponent,
    ProjectSelectorComponent,
    UserSelectorComponent,
    SessionTypeSelectorComponent,
    LogoComponent,
    DatetimeSelectorComponent,
    ParticipantSelectorComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    RoomFormDialogComponent
  ],
  providers: []
})
export class SharedModule {
}
