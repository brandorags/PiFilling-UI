import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

export class Constants {
  static readonly apiBaseUrl = environment.apiBaseUrl;
  static readonly lengthOfSession = environment.lengthOfSession;
  static readonly userCookieKey = 'currentUser';
  static readonly httpOptionsAuth = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };
}
