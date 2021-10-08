import { LabelingPolygonComponent } from './labeling-polygon/labeling-polygon.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { ReviewLabelsComponent } from './review-labels/review-labels.component';
import { LabelingComponent } from './labeling/labeling.component';
import { LabelsComponent } from './labels/labels.component';
import { ClassesComponent } from './classes/classes.component';
import { RegisterComponent } from './user/register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationGuard } from './auth/authentication.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './user/login/login.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogOutComponent } from './user/log-out/log-out.component';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {path: 'user', component:UserComponent,
    children:[
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'logout', component: LogOutComponent },
    ]
  },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthenticationGuard] },
  { path: 'classes', component: ClassesComponent,canActivate:[AuthenticationGuard] },
  { path: 'labels', component: LabelsComponent,canActivate:[AuthenticationGuard] },
  { path: 'labeling', component: LabelingComponent,canActivate:[AuthenticationGuard] },
  { path: 'review-labels', component: ReviewLabelsComponent, canActivate:[AuthenticationGuard]},
  { path: 'review-detail/:id', component: ReviewDetailComponent, canActivate:[AuthenticationGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
