import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { SessionTimerService } from '../common/session-timer.service';
import { Constants } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private sessionTimerService: SessionTimerService
  ) { }

  canActivate() {
    if (this.isUserLoggedIn()) {
      this.sessionTimerService.refreshTimer();
      return true;
    } else {
      this.router.navigate(['/']);
    }

    return false;
  }

  private isUserLoggedIn(): boolean {
    let currentUserCookie = Constants.userCookieKey;
    if (document.cookie.includes(currentUserCookie)) {
      return true;
    }

    return false;
  }

}
