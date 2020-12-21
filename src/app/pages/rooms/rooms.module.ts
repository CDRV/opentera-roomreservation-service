import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {RoomsComponent} from './rooms.component';

@NgModule({
  declarations: [RoomsComponent],
  imports: [
    SharedModule,
    CommonModule,
  ]
})
export class RoomsModule {
}
