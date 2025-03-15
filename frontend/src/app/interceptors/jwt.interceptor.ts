// src/app/interceptors/jwt.interceptor.ts
import {
    Injectable,
    Injector,
  } from '@angular/core';
  import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
  } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { AuthService } from '../services/auth.service';
  
  @Injectable()
  export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.authService.getToken();
  
      if (token) {
        // Clone the request and attach the Authorization header
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      return next.handle(req);
    }
  }
  