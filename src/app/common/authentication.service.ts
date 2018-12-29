import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/login/user';
import { Constants } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isUserLoggedInSource = new BehaviorSubject<boolean>(false);
  public isUserLoggedInObservable = this.isUserLoggedInSource.asObservable();

  constructor(private http: HttpClient) { }

  login(user: User): Observable<User> {
    return this.http.post<User>(Constants.apiBaseUrl + 'api/login', user, Constants.httpOptionsAuth)
      .pipe(map(
        loggedInUser => {
          this.createUserDataCache(loggedInUser);
          this.setLoggedInStatus(true);

          return loggedInUser;
        },
        error => {
          return error;
        }
      ));
  }

  logout(): Observable<any> {
    return this.http.post<any>(Constants.apiBaseUrl + 'api/logout', JSON.stringify(''), Constants.httpOptionsAuth)
      .pipe(map(
        response => {
          this.deleteUserDataCache();
          this.setLoggedInStatus(false);
          localStorage.clear();

          return response;
        },
        error => {
          return error;
        }
      ));
  }

  setLoggedInStatus(isUserLoggedIn: boolean): void {
    this.isUserLoggedInSource.next(isUserLoggedIn);
  }

  private createUserDataCache(user: User): void {
    document.cookie = Constants.userCookieKey + '=loggedIn';
    localStorage.setItem(Constants.usernameLocalStorageKey, user.username);
  }

  private deleteUserDataCache(): void {
    document.cookie = Constants.userCookieKey + '=; Max-Age=0';
    localStorage.removeItem(Constants.usernameLocalStorageKey);
  }

}
