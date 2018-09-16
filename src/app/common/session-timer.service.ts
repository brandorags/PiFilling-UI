import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SimpleTimer } from 'ng2-simple-timer';

import { AuthenticationService } from './authentication.service';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class SessionTimerService {

  constructor(
    private timer: SimpleTimer,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  startTimer(): void {
    let sessionTimerId = 'sessionTimer';
    let interval = 5;
    let counter = 0;

    this.timer.newTimer(sessionTimerId, interval);
    this.timer.subscribe(sessionTimerId, () => {
      counter += interval;

      if (counter >= Constants.lengthOfSession) {
        this.stopTimer();
        this.authService.logout().subscribe(
          success => {
            this.router.navigate(['/']);
          },
          error => {
            console.log(error.message);
          }
        );
      }
    });
  }

  stopTimer(): void {
    let subscriptions = this.timer.getSubscription();
    this.timer.unsubscribe(subscriptions[0]);
  }

  restartTimer(): void {
    this.stopTimer();
    this.startTimer();
  }

  refreshTimer(): void {
    if (this.isTimerRunning()) {
      this.restartTimer();
    } else {
      this.startTimer();
    }
  }

  isTimerRunning(): boolean {
    let runningTimers = this.timer.getTimer();
    return runningTimers.length > 0 ? true : false;
  }

}
