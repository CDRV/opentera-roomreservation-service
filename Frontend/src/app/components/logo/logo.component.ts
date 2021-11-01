import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  @Input() style: string;
  logoPath = environment.img_prefix + 'assets/images/logo_rr.svg';
  firstLine = 'OpenTera';
  secondLine = 'Réservation de locaux';

  constructor() {
  }

  ngOnInit(): void {
  }
}
