// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

// user-defined modules
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';

// user-defined components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
