import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Pages} from '@core/utils/pages';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  imagePath = environment.img_prefix + 'assets/images/puzzle.svg';

  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  goHome(): void {
    this.router.navigate([Pages.homePage]);
  }
}
