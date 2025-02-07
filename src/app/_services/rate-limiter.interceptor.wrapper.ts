import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RateLimitingInterceptor } from './rate-limiter.interceptor';

@Injectable()
export class RateLimitingInterceptorWrapper implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Convertimos 'next' de HttpHandler a HttpHandlerFn
    const nextFn = (req: HttpRequest<any>) => next.handle(req);
    return RateLimitingInterceptor(req, nextFn);
  }
}