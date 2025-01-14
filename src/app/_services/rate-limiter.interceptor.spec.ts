import { TestBed } from '@angular/core/testing';

import { RateLimiterInterceptor } from './rate-limiter.interceptor';

describe('RateLimiterInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RateLimiterInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RateLimiterInterceptor = TestBed.inject(RateLimiterInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
