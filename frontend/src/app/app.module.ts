import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageComponent } from './page/page.component';
import { UpdateComponent } from './update/update.component';
import { ViewComponent } from './view/view.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAuthGuard } from './admin.auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
    LoginComponent,
    PageComponent,
    
    AdminLoginComponent,
    UpdateComponent,
    ViewComponent,
    AdminDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // For [(ngModel)] binding
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    AuthService, AuthGuard, AdminAuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
