import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SanctionsService, Sanction, Tournament, Team } from '../service/sanctions.service';
import { Category } from '../service/categories.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TournamentService } from '../service/tournament.service';
import { ManagerService } from 'src/app/manager/manager.service';

@Component({
  selector: 'app-sanctions',
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule
  ]
})
export class SanctionsComponent implements OnInit {
  sanctions: Sanction[] = [];
  tournaments: Tournament[] = [];
  categories: Category[] = [];
  teams: Team[] = [];
  dates: any[] = [];
  filteredTeams: Team[] = [];
  sactionTournament: number | null = null;
  teamSearchText: string = '';
  filterTeamSearchText: string = '';
  
  sanctionForm: FormGroup;
  isEditMode = false;
  currentSanctionId: number | null = null;
  showForm = false;
  loading = false;
  error = '';
  games: any[] = [];
  players: any[] = [];
  
  selectedTournament: number | null = null;
  selectedTeam: number | null = null;
  selectedCategory: number | null = null;
  
  displayedColumns: string[] = ['id', 'sanction_for', 'reason', 'points','missed_dates', 'yellow_cards', 'red_card', 'game', 'player', 'actions']
  
  constructor(
    private sanctionsService: SanctionsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private tournamentService: TournamentService,
    private managerService: ManagerService
  ) {
    this.sanctionForm = this.fb.group({
      sanction_for: ['P', [Validators.required]],
      reason: ['', ],
      missed_dates: [0],
      yellow_cards: [''],
      red_card: [''],
      game: [0],
      team: [0],
      player: [0],
      missed_points: [0]
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();
  }

  loadSanctions(): void {
    this.loading = true;
    this.sanctionsService.getAllSanctions().subscribe({
      next: (data) => {
        this.sanctions = data.sort((a, b) => b.id! - a.id!);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading sanctions';
        console.error(err);
        this.showSnackBar('Error loading sanctions', 'error');
        this.loading = false;
      }
    });
  }

  loadFilterOptions(): void {
    this.loading = true;
    this.sanctionsService.getTournaments().subscribe({
      next: (data) => {
        this.tournaments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournaments:', err);
        this.showSnackBar('Error loading tournaments', 'error');
        this.loading = false;
      }
    });
    
    this.sanctionsService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.showSnackBar('Error loading categories', 'error');
        this.loading = false;
      }
    });
    
    this.sanctionsService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.filteredTeams = [...this.teams];
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.showSnackBar('Error loading teams', 'error');
      }
    });
  }

  applyFilters(): void {
    if (!this.selectedTournament) {
      this.error = 'Debe seleccionar un torneo para ver las sanciones';
      this.showSnackBar('Debe seleccionar un torneo para ver las sanciones', 'error');
      this.sanctions = [];
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.sanctionsService.filterSanctions(
      this.selectedTournament,
      this.selectedTeam || undefined,
      this.selectedCategory || undefined
    ).subscribe({
      next: (data) => {
        this.sanctions = data.sort((a, b) => b.id! - a.id!);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al filtrar sanciones';
        console.error(err);
        this.showSnackBar('Error al filtrar sanciones', 'error');
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.selectedTournament = null;
    this.selectedTeam = null;
    this.selectedCategory = null;
    this.sanctions = [];
    this.error = '';
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.currentSanctionId = null;
    this.sanctionForm.reset({
      sanction_for: 'P',
      reason: '',
      missed_dates: 0,
      yellow_cards: '',
      red_card: '',
      game: 0,
      player: 0,
      team: 0,
      missed_points: 0,
      tournament: 0
    });

    this.showForm = true;
  }

  loadGames(dateId: number): void {
    this.loading = true;
    this.games = [];
    this.tournamentService.getMatchesByDate(dateId).then((data) => {
      this.games = data.filter((game: any) => game.tournament == this.sactionTournament);
      this.loading = false;
    }).catch((err) => {
      console.error('Error loading games:', err);
      this.showSnackBar('Error loading games', 'error');
      this.loading = false;
    });
  }

  loadDates(tournamentId: number): void {
    this.loading = true;
    this.sactionTournament = tournamentId;
    this.dates = [];
    this.tournamentService.getDatesByTournament(tournamentId).then((data) => {
      this.dates = data;
      this.loading = false;
    }).catch((err) => {
      console.error('Error loading dates:', err);
      this.showSnackBar('Error loading dates', 'error');
      this.loading = false;
    });
  }

  filterTeams(): void {
    if (!this.teamSearchText) {
      this.filteredTeams = [...this.teams];
      return;
    }
    
    const searchText = this.teamSearchText.toLowerCase();
    this.filteredTeams = this.teams.filter(team => 
      team.name.toLowerCase().includes(searchText)
    );
  }

  filterTeamsInFilters(): void {
    if (!this.filterTeamSearchText) {
      this.filteredTeams = [...this.teams];
      return;
    }
    
    const searchText = this.filterTeamSearchText.toLowerCase();
    this.filteredTeams = this.teams.filter(team => 
      team.name.toLowerCase().includes(searchText)
    );
  }

  onTeamChange(event: any): void {
    const teamId = event.value;
    this.loadPlayers(teamId);
  }

  loadPlayers(teamId: number): void {
    this.loading = true;
    this.managerService.getTeam(teamId).subscribe({
      next: (data) => {
        this.players = data.players;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading players:', err);
        this.showSnackBar('Error loading players', 'error');
        this.loading = false;
      }
    });
  }

  openEditForm(sanction: Sanction): void {
    this.isEditMode = true;
    this.currentSanctionId = sanction.id || null;
    this.sanctionForm.patchValue({
      sanction_for: sanction.sanction_for,
      reason: sanction.reason,
      missed_dates: sanction.missed_dates,
      yellow_cards: sanction.yellow_cards,
      red_card: sanction.red_card,
      game: sanction.game,
      team: sanction.team,
      player: sanction.player,
      missed_points: sanction.missed_points  
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.error = '';
    this.sanctionForm.reset();
  }

  saveSanction(): void {
    if (this.sanctionForm.invalid) {
      this.sanctionForm.markAllAsTouched();
      return;
    }

    const sanction: Sanction = this.sanctionForm.value;
    sanction.tournament = this.sactionTournament || 0;

    if (this.isEditMode && this.currentSanctionId) {
      this.sanctionsService.updateSanction(this.currentSanctionId, sanction).subscribe({
        next: () => {
          this.loadSanctions();
          this.showForm = false;
          this.showSnackBar('Sanction updated successfully', 'success');
        },
        error: (err) => {
          this.error = 'Error updating sanction';
          console.error(err);
          this.showSnackBar('Error updating sanction', 'error');
        }
      });
    } else {

      this.sanctionsService.createSanction(sanction).subscribe({
        next: () => {
          this.loadSanctions();
          this.showForm = false;
          this.showSnackBar('Sanction created successfully', 'success');
        },
        error: (err) => {
          this.error = 'Error creating sanction';
          console.error(err);
          this.showSnackBar('Error creating sanction', 'error');
        }
      });
    }
  }

  deleteSanction(id: number): void {
    if (confirm('Are you sure you want to delete this sanction?')) {
      this.sanctionsService.deleteSanction(id).subscribe({
        next: () => {
          this.loadSanctions();
          this.showSnackBar('Sanction deleted successfully', 'success');
        },
        error: (err) => {
          this.error = 'Error deleting sanction';
          console.error(err);
          this.showSnackBar('Error deleting sanction', 'error');
        }
      });
    }
  }

  showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['bg-green-600', 'text-white'] : ['bg-red-600', 'text-white']
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  getSanctionForLabel(code: string): string {
    const options: {[key: string]: string} = {
      'P': 'Player',
      'T': 'Team',
      'C': 'Coach'
    };
    return options[code] || code;
  }

  convertPoints(points: number): string {
    if (points === 0 || points === null || points === undefined) {
      return '0 pts';
    } else if (points < 0) {
      return '+' + Math.abs(points) + ' pts';
    } else {
      return '-' + points + ' pts';
    }
  }
}
