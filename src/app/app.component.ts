import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './common/authentication.service';
import { Constants } from './common/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isUserLoggedIn: boolean;

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authService.isUserLoggedInObservable.subscribe(isLoggedIn => this.isUserLoggedIn = isLoggedIn);

    let currentUserCookie = Constants.userCookieKey;

    if (!document.cookie.includes(currentUserCookie)) {
      this.isUserLoggedIn = false;
    } else {
      this.isUserLoggedIn = true;
    }
  }

}
