import {Injectable, Injector, NgZone} from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private router: Router
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const ngZone = this.injector.get(NgZone);
    const authService = this.injector.get(AuthenticationService);

    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logOut().subscribe();
          ngZone.run(() => this.router.navigate(['/connexion']));
        } else {
          return throwError(error);
        }
      })
    );
  }
}
