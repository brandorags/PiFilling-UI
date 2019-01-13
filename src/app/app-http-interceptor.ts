/**
 * Copyright 2018-2019 Brandon Ragsdale
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
