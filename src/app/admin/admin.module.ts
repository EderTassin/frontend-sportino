import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team/team.component';
import { LoadDataMatchComponent } from './load-data-match/load-data-match.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_services/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../_services/pipe/filter.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../_services/auth.interceptor';
import { DelegadosComponent } from './delegados/delegados.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { SubTournamentDialogComponent } from './tournaments/sub-tournament-dialog/sub-tournament-dialog.component';
import { TournamentDialogComponent } from './tournaments/tournament-dialog/tournament-dialog.component';
import { TournamentPreviewComponent } from './tournaments/tournament-preview/tournament-preview.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImprimirDocumentosComponent } from './imprimir-documentos/imprimir-documentos.component';
import { DateManagementComponent } from './date-management/date-management.component';
import { ResultsComponent } from './results/results.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CategoriesComponent } from './categories/categories.component';
import { SanctionsComponent } from './sanctions/sanctions.component';
import { RemovePointsComponent } from './remove-points/remove-points.component';
import { PlayersComponent } from './players/players.component';
import { ManagerImgPortadaComponent } from './manager-img-portada/manager-img-portada.component';

const routes: Routes = [
  { path: '', component: HomeAdminComponent, canActivate: [AuthGuard] },
  { path: 'torneos', component: TournamentsComponent, canActivate: [AuthGuard] },
  { path: 'equipos', component: TeamComponent, canActivate: [AuthGuard] },
  { path: 'load-data-match', component: LoadDataMatchComponent, canActivate: [AuthGuard] },
  { path: 'participantes', component: DelegadosComponent, canActivate: [AuthGuard] },
  { path: 'imprimir-documentos', component: ImprimirDocumentosComponent, canActivate: [AuthGuard] },
  { 
    path: 'tournament-summary/:id', 
    loadChildren: () => import('../create-tournaments/tounament.module').then(m => m.TournamentModule) 
  },
  { path: 'gestionar-fechas', component: DateManagementComponent, canActivate: [AuthGuard] },
  { path: 'cargar-resultados', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'sanciones', component: SanctionsComponent, canActivate: [AuthGuard] },
  { path: 'quitar-puntos', component: RemovePointsComponent, canActivate: [AuthGuard] },
  { path: 'players', component: PlayersComponent, canActivate: [AuthGuard] },
  { path: 'administrar-jugadores', component: PlayersComponent, canActivate: [AuthGuard] },
  { path: 'manager-img-portada', component: ManagerImgPortadaComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    TournamentsComponent,
    TeamComponent,
    LoadDataMatchComponent,
    HomeAdminComponent,
    FilterPipe,
    DelegadosComponent,
    ImprimirDocumentosComponent,
    DateManagementComponent,
    ResultsComponent,
    RemovePointsComponent,
    SubTournamentDialogComponent,
    TournamentDialogComponent,
    TournamentPreviewComponent,
    ManagerImgPortadaComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  exports: [RouterModule]
})

export class AdminModule { }
