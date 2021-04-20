import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '@shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {
}
