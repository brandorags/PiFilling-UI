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


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material';

import { Observable, Subject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthenticationService } from './common/authentication.service';
import { FileService } from './file/file.service';
import { SessionTimerService } from './common/session-timer.service';

import { Constants } from './common/constants';
import { NewFolderDialogComponent } from './file/new-folder-dialog/new-folder-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  partialFilenameChanged = new Subject<any>();
  partialFilenameChangedSubscription: Subscription;

  isUserLoggedIn: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private fileService: FileService,
    private sessionTimerService: SessionTimerService
  ) { }

  ngOnInit() {
    this.authService.isUserLoggedInObservable.subscribe(isLoggedIn => this.isUserLoggedIn = isLoggedIn);

    this.partialFilenameChangedSubscription = this.partialFilenameChanged
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(event => {
        let partialFilename = event.srcElement.value;
        if (partialFilename.length >= 2) {
          this.fileService.partialFilenameSearchEmitter.emit(partialFilename);
        }
      });

    let currentUserCookie = Constants.userCookieKey;
    if (!document.cookie.includes(currentUserCookie)) {
      this.isUserLoggedIn = false;
    } else {
      this.isUserLoggedIn = true;
    }
  }

  ngOnDestroy(): void {
    this.partialFilenameChangedSubscription.unsubscribe();
  }

  queueUpload(fileList: FileList): void {
    this.fileService.fileListEventEmitter.emit(fileList);
  }

  openNewFolderDialog(): void {
    const newFolderDialog = this.dialog.open(NewFolderDialogComponent, {
      width: '350px',
      data: { folderName: '' }
    });
    newFolderDialog.afterClosed().subscribe(folderName => {
      if (folderName !== undefined) {
        this.fileService.newFolderEventEmitter.emit(folderName);
      }
    });
  }

  logoutUser(event: any): void {
    event.preventDefault();

    this.authService.logout().subscribe(
      success => {
        this.sessionTimerService.stopTimer();
        this.router.navigate(['/login']);
        console.log(success.message);
      },
      error => {
        console.log(error.message);
      }
    );
  }

}
