import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RateLimitingInterceptorWrapper } from './rate-limiter.interceptor.wrapper';

describe('RateLimitingInterceptor con endpoint externo', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  // Definimos la URL de prueba (sin la barra final para evitar posibles conflictos de matching)
  const testUrl = 'https://api.sportino.com.ar/api/calendars/tournament';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: RateLimitingInterceptorWrapper, multi: true }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debería permitir 5 solicitudes y bloquear la sexta con error 429', (done) => {
    // Simulamos 5 solicitudes al endpoint
    for (let i = 0; i < 5; i++) {
      httpClient.get(testUrl).subscribe({
        next: () => {
          // Respuesta exitosa
        },
        error: () => {
          fail('No se esperaba error en una solicitud permitida');
        }
      });
  
      const req = httpTestingController.expectOne(testUrl);
      req.flush({ message: 'ok' });
    }

    // La sexta solicitud debe ser bloqueada por el interceptor
    httpClient.get(testUrl).subscribe({
      next: () => {
        fail('La sexta solicitud no debería permitirse');
      },
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(429);
        expect(err.error).toBe('Rate limit exceeded');
        done();
      }
    });
    // No llamamos a expectOne para la sexta solicitud ya que el interceptor la bloquea antes de enviarla.
  });
});
