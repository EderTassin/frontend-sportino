import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SelectTournamentComponent } from './select-tournament/select-tournament.component';
import { MatchStatisticsComponent } from './match-statistics/match-statistics.component';
import { RegisterComponent } from './login/register/register.component';

const routes: Routes = [
  {path:'',component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'register', component: RegisterComponent },
  {path:'tournament', component: SelectTournamentComponent},
  {path:'match-statistics/:id', component: MatchStatisticsComponent },
  {path:'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
