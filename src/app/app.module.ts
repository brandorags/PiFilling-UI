/**
 * Copyright 2018 Brandon Ragsdale
 *
 * This file is part of PiFilling-UI.
 *
 * PiFilling-UI is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PiFilling-UI is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with PiFilling-UI.  If not, see <https://www.gnu.org/licenses/>.
 */


// Angular
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

// third-party modules
import { SimpleTimer } from 'ng2-simple-timer';

// user-defined modules
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';

// user-defined HTTP interceptor
import { AppHttpInterceptor } from './app-http-interceptor';

// user-defined guards
import { AuthGuard } from './guards/auth.guard';

// user-defined components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FileComponent } from './file/file.component';
import { NewFolderDialogComponent } from './file/new-folder-dialog/new-folder-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    FileComponent,
    NewFolderDialogComponent
  ],
  entryComponents: [
    NewFolderDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    SimpleTimer,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
