import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { FileComponent } from './file/file.component';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'files', component: FileComponent, canActivate: [AuthGuard] },
  { path: '', component: AppComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
