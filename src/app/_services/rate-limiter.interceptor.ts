import { HttpInterceptorFn } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';

const requests: Map<string, number[]> = new Map();

export const RateLimitingInterceptor: HttpInterceptorFn = (req, next) => {
  const RATE_LIMIT_INTERVAL = 60000;
  const REQUEST_LIMIT = 5;

  const currentTime = Date.now();
  const requestKey = `${req.method}:${req.urlWithParams}`;

  if (!requests.has(requestKey)) {
    requests.set(requestKey, []);
  }

  const timestamps = requests.get(requestKey);
  if (timestamps) {
    while (
      timestamps.length > 0 &&
      currentTime - timestamps[0] > RATE_LIMIT_INTERVAL
    ) {
      timestamps.shift();
    }

    if (timestamps.length >= REQUEST_LIMIT) {
      return throwError(() => new Error('Rate limit exceeded'));
    }

    timestamps.push(currentTime);
  }

  return next(req).pipe(
    catchError((err) => {
      requests.delete(requestKey);
      return throwError(() => err);
    })
  );
};
