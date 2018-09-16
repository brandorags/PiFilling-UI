import { Component, OnInit } from '@angular/core';

import { User } from '../models/login/user';
import { AuthenticationService } from '../common/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = new User();

  constructor(private authService: AuthenticationService) { }

  ngOnInit() { }

  loginUser(): void {
    this.authService.login(this.user)
      .subscribe(
        user => {
          console.log(`Welcome, ${user.username}!`);
        },
        error => {
          console.log(error.message);
        }
      );
  }

}
