import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationService} from '@services/authentication.service';
import {GlobalConstants} from '../utils/global-constants';
import {makeApiURL} from '../utils/make-api-url';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private cookieValue = GlobalConstants.cookieValue;

  constructor(private authenticationService: AuthenticationService,
              private cookieService: CookieService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookieService.get(this.cookieValue);
    const isLoggedIn = this.authenticationService.isAuthenticated() && !!token;
    const isApiUrl = request.url.startsWith(makeApiURL()) || request.url.startsWith(makeApiURL(true));
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {Authorization: `OpenTera ${token}`}
      });
    }

    return next.handle(request);
  }
}
