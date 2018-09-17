import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { User } from '../models/login/user';
import { AuthenticationService } from '../common/authentication.service';

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
    private authService: AuthenticationService
  ) { }

  ngOnInit() { }

  loginUser(): void {
    this.authService.login(this.user)
      .subscribe(
        user => {
          this.router.navigate(['/files']);
          this.snackBar.open(`Welcome, ${user.username}!`);
        },
        error => {
          console.log(error.message);
        }
      );
  }

}
