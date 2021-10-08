import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthServiceService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.auth.getToken();
    if(token!=null){
      request = request.clone({
        setHeaders: {
          "Access-Control-Allow-Origin":"*",
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      });
    }

    return next.handle(request);
  }
}
