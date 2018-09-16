import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from './common/authentication.service';
import { Constants } from './common/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isUserLoggedIn: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
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

  logoutUser(e: any): void {
    e.preventDefault();

    this.authService.logout().subscribe(
      success => {
        this.router.navigate(['/login']);
        console.log(success.message);
      },
      error => {
        console.log(error.message);
      }
    );
  }

}
