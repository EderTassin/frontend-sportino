import { HttpInterceptorFn } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

const requests: Map<string, number[]> = new Map();

export const RateLimitingInterceptor: HttpInterceptorFn = (req, next) => {
  const RATE_LIMIT_INTERVAL = 60; // 60 segundos
  const REQUEST_LIMIT = 10;

  const currentTime = Date.now();
  const requestKey = `${req.method}:${req.urlWithParams}`;

  if (!requests.has(requestKey)) {
    requests.set(requestKey, []);
  }

  const timestamps = requests.get(requestKey);
  
  if (timestamps) {
    while (timestamps.length > 0 && currentTime - timestamps[0] > RATE_LIMIT_INTERVAL) {
      timestamps.shift();
    }

    if (timestamps.length >= REQUEST_LIMIT) {
      return throwError(() => new HttpErrorResponse({ 
        status: 429,
        statusText: 'Too Many Requests',
        error: 'Rate limit exceeded' 
      }));
    }

    timestamps.push(currentTime);
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 429) {
        requests.delete(requestKey);
      }
      return throwError(() => err);
    })
  );
};
