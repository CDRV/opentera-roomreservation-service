import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {UserInfosService} from '../../../services/user-infos.service';
import {UserInfos} from '@models/user-infos.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userInfos: UserInfos;
  initial = '';

  constructor(private authService: AuthenticationService,
              private userInfosService: UserInfosService) {
  }

  ngOnInit(): void {
    this.userInfosService.userInfos$().subscribe((userInfos) => {
      if (userInfos && userInfos.user_fullname) {
        this.userInfos = userInfos;
        this.initial = userInfos.user_fullname.charAt(0);
      }
    });
  }

  logout() {
    this.authService.logOut().subscribe();
  }
}
