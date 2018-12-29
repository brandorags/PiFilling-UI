import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from './common/authentication.service';
import { FileService } from './file/file.service';

import { Constants } from './common/constants';
import { NewFolderDialogComponent } from './file/new-folder-dialog/new-folder-dialog.component';

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
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private fileService: FileService
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

  queueUpload(fileList: FileList): void {
    this.fileService.fileListEventEmitter.emit(fileList);
  }

  openNewFolderDialog(): void {
    const newFolderDialog = this.dialog.open(NewFolderDialogComponent, {
      width: '350px',
      data: { folderName: '' }
    });
    newFolderDialog.afterClosed().subscribe(folderName => {
      this.fileService.newFolderEventEmitter.emit(folderName);
    });
  }

  logoutUser(event: any): void {
    event.preventDefault();

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
