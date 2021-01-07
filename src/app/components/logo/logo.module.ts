import {NgModule} from '@angular/core';
import {LogoComponent} from './logo.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [LogoComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule.forRoot()
  ],
  exports: [LogoComponent]
})
export class LogoModule {
}
