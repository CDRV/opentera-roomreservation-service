import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LogoModule} from '../../components/logo/logo.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    LogoModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {
}
