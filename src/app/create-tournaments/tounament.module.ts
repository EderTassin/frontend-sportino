import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CreateTournamentsComponent } from './create-tournaments.component';
import { TournamentFormComponent } from './tournament-form/tournament-form.component';
import { TournamentSummaryComponent } from './tournament-summary/tournament-summary.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/_services/auth.interceptor';
import { DatesFormComponent } from './dates-form/dates-form.component';
import { MatchesFormComponent } from './matches-form/matches-form.component';
import { AuthGuard } from '../_services/auth-guard.service';

const routes: Routes = [
  { 
    path: '', 
    component: CreateTournamentsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: ':id', 
    component: CreateTournamentsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tournament-summary/:id', 
    component: TournamentSummaryComponent, 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  declarations: [
    CreateTournamentsComponent,
    TournamentFormComponent,
    TournamentSummaryComponent,
    DatesFormComponent,
    MatchesFormComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentModule { }

