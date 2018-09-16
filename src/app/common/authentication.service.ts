import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/login/user';
import { Constants } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(user: User): Observable<User> {
    return this.http.post<User>(Constants.apiBaseUrl + 'api/login', user, Constants.httpOptionsAuth)
      .pipe(map(
        loggedInUser => {
          return loggedInUser;
        },
        error => {
          return error;
        }
      ));
  }

}
