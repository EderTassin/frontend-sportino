import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatchStatisticsComponent } from './match-statistics/match-statistics.component';
import { SelectTournamentComponent } from './select-tournament/select-tournament.component';
import { AuthService } from './_services/auth.service';
import { RegisterComponent } from './login/register/register.component';
import { LoadingInterceptor } from './shared/loader/loading.interceptor';
import { LoadingComponent } from './shared/loader/loading.component';
import { LoadingService } from './shared/loader/loading.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
    LoadingComponent
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
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AuthService,
    LoadingService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
