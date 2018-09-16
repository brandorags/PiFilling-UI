import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SessionTimerService } from './common/session-timer.service';

@Injectable()
export class AppHttpInterceptor {

  constructor(
    private sessionTimerService: SessionTimerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.sessionTimerService.refreshTimer();
    return next.handle(req);
  }

}
