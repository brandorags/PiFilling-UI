import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../common/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService
  ) { }

  logoutUser(): void {
    this.authService.logout().subscribe(
      success => {
        this.router.navigate(['/']);
      },
      error => {
        console.log(error.message);
      }
    );
  }

}
