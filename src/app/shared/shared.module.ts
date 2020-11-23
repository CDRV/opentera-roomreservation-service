import {NgModule} from '@angular/core';
import {CalendarComponent} from '../components/calendar/calendar.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FlatpickrModule} from 'angularx-flatpickr';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {MatButtonModule} from '@angular/material/button';
import {SiteSelectionComponent} from '../components/site-selection/site-selection.component';
import {RoomSelectionComponent} from '../components/room-selection/room-selection.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {ConfirmationDialogComponent} from '../components/confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RoomFormDialogComponent} from '../components/room-form-dialog/room-form-dialog.component';
import {MatInputModule} from '@angular/material/input';
import {ReservationFormDialogComponent} from '../components/reservation-form-dialog/reservation-form-dialog.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';


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
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CalendarComponent,
    SiteSelectionComponent,
    RoomSelectionComponent,
    ConfirmationDialogComponent,
    RoomFormDialogComponent,
    ReservationFormDialogComponent
  ],
  exports: [
    CalendarComponent,
    SiteSelectionComponent,
    RoomSelectionComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    RoomFormDialogComponent,
    ReservationFormDialogComponent
  ]
})
export class SharedModule {
}
