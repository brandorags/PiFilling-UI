import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AuthenticationService } from '../common/authentication.service';
import { SessionTimerService } from '../common/session-timer.service';

import { User } from '../models/login/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = new User();

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private sessionTimerService: SessionTimerService
  ) { }

  ngOnInit() { }

  loginUser(): void {
    this.authService.login(this.user)
      .subscribe(
        user => {
          this.sessionTimerService.startTimer();
          this.router.navigate(['/files']);
          this.snackBar.open(`Welcome, ${user.username}!`);
        },
        error => {
          console.log(error.message);
        }
      );
  }

}
