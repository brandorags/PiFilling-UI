import { environment } from '../../environments/environment';

export class Constants {
  static readonly apiBaseUrl = environment.apiBaseUrl;
  static readonly fileStorageBaseUrl = environment.fileStorageBaseUrl;
  static readonly lengthOfSession = environment.lengthOfSession;
  static readonly userCookieKey = 'currentUser';
  static readonly usernameLocalStorageKey = 'username';
  static readonly httpOptionsAuth = {
    withCredentials: true
  };
}
