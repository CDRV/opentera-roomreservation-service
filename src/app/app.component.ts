import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {CookieService} from 'ngx-cookie-service';
import {GlobalConstants} from './core/utils/global-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private cookieService: CookieService,
              private authService: AuthenticationService) {
  }

  ngOnInit() {
    if (!!this.cookieService.get(GlobalConstants.cookieValue)) {
      this.authService.startRefreshTokenTimer();
    }
  }
}
