import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { PageComponent } from './page/page.component';
import { UpdateComponent } from './update/update.component';
import { ViewComponent } from './view/view.component';
import { AuthGuard } from './auth.guard';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAuthGuard } from './admin.auth.guard';

const routes: Routes = [

{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full',
},
{
  path: '',
  component: UserLayoutComponent,
  children: [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: PageComponent, canActivate: [AuthGuard] },
  { path: 'update', component: UpdateComponent, canActivate: [AuthGuard] },
  { path: 'view', component: ViewComponent, canActivate: [AuthGuard] },
  ],
},
{
  path: 'admin',
  component: AdminLayoutComponent,
  children: [
    { path: 'login', component: AdminLoginComponent },
    {path:'dashboard', component:AdminDashboardComponent, canActivate : [AdminAuthGuard]}
  ],
},
{ path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
