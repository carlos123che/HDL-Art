import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { FileuploadComponent } from './components/fileupload/fileupload.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { PictureComponent } from './components/picture/picture.component';
import { AboutComponent } from './components/about/about.component';
import { NewsComponent } from './components/news/news.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'verify-email', component: VerifyEmailComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'upload', component: FileuploadComponent},
  { path: 'category', component: CategoriesComponent},
  { path: 'picture/:id', component: PictureComponent},
  { path: 'about', component: AboutComponent},
  { path: 'news', component: NewsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
