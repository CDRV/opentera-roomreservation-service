import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '@services/authentication.service';
import {Router} from '@angular/router';
import {GlobalConstants} from '@core/utils/global-constants';
import {LoginButtonService} from '@services/login-button.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loginInvalid: boolean;
  isButtonDisabled: boolean;
  version = GlobalConstants.version;
  organism = GlobalConstants.organism;
  private formSubmitAttempt: boolean;
  private subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginButtonService: LoginButtonService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.redirect();

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.subscription = this.loginButtonService.isDisabled().subscribe((isDisabled) => {
      this.isButtonDisabled = isDisabled;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private redirect() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    this.loginButtonService.disableButton(true);
    this.isButtonDisabled = true;
    if (this.form.valid) {
      try {
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;
        this.authService.logIn(username, password).subscribe(() => {
          this.loginButtonService.disableButton(false);
        });
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
