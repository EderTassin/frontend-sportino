import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTournamentsComponent } from './create-tournaments/create-tournaments.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { LoadDataMatchComponent } from './load-data-match/load-data-match.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_services/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../_services/pipe/filter.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../_services/auth.interceptor';
import { DelegadosComponent } from './delegados/delegados.component';


const routes: Routes = [
  { path: '', component: HomeAdminComponent, canActivate: [AuthGuard] },
  { path: 'tournaments', component: CreateTournamentsComponent, canActivate: [AuthGuard] },
  { path: 'equipos', component: CreateTeamComponent, canActivate: [AuthGuard] },
  { path: 'load-data-match', component: LoadDataMatchComponent, canActivate: [AuthGuard] },
  { path: 'participantes', component: DelegadosComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    CreateTournamentsComponent,
    CreateTeamComponent,
    LoadDataMatchComponent,
    HomeAdminComponent,
    FilterPipe,
    DelegadosComponent
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

export class AdminModule { }
