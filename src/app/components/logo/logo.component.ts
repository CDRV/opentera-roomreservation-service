import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  logoPath = './assets/images/logo_rr.svg';
  firstLine = 'OpenTera'
  secondLine = 'Réservation de locaux'

  constructor() {
  }

  ngOnInit(): void {
  }

}
