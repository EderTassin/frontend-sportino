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

import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu'
import { TablaJugadoresComponent } from './home/tabla-jugadores/tabla-jugadores.component';

import KeenSlider from 'keen-slider'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [	
    AppComponent,
      HomeComponent,
      HeaderComponent,
      FooterComponent,
      LoginComponent,
      TablaFixtureComponent,
      TablaJugadoresComponent
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
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
