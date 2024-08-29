import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTournamentsComponent } from './create-tournaments/create-tournaments.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { LoadDataMatchComponent } from './load-data-match/load-data-match.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_services/auth-guard.service';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../_services/pipe/filter.pipe';


const routes: Routes = [
  { path: '', component: HomeAdminComponent, canActivate: [AuthGuard] },
  { path: 'tournaments', component: CreateTournamentsComponent, canActivate: [AuthGuard] },
  { path: 'create-team', component: CreateTeamComponent, canActivate: [AuthGuard] },
  { path: 'load-data-match', component: LoadDataMatchComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    CreateTournamentsComponent,
    CreateTeamComponent,
    LoadDataMatchComponent,
    HomeAdminComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminModule { }
