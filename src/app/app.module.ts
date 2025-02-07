import { NgModule, isDevMode, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TablaFixtureComponent } from './home/tabla-fixture/tabla-fixture.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu'
import { TablaJugadoresComponent } from './home/tabla-jugadores/tabla-jugadores.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatchStatisticsComponent } from './match-statistics/match-statistics.component';
import { SelectTournamentComponent } from './select-tournament/select-tournament.component';
import { AuthService } from './_services/auth.service';
import { RegisterComponent } from './login/register/register.component';
import { LoadingInterceptor } from './shared/loader/loading.interceptor';
import { LoadingComponent } from './shared/loader/loading.component';
import { LoadingService } from './shared/loader/loading.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CamelcasePipe } from './_services/pipe/camelcase.pipe';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RateLimitingInterceptor } from './_services/rate-limiter.interceptor';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    TablaFixtureComponent,
    TablaJugadoresComponent,
    MatchStatisticsComponent,
    SelectTournamentComponent,
    RegisterComponent,
    LoadingComponent,
    CamelcasePipe,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    MatMenuModule,
    MatTabsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    }),
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService,
    LoadingService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    provideHttpClient(
      withInterceptors([RateLimitingInterceptor])
    ),
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
