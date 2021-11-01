import {Component, OnInit} from '@angular/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {ThemePalette} from '@angular/material/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  logoPath = environment.img_prefix + 'assets/images/logo_rr.svg';

  constructor() {
  }

  ngOnInit(): void {
  }

}
