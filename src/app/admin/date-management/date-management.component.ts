import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { TournamentService } from 'src/app/create-tournaments/service/tournament.service';
import { AdminService } from '../service/admin.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DateService, Game } from '../service/date.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-date-management',
  templateUrl: './date-management.component.html',
  styleUrls: ['./date-management.component.scss']
})
export class DateManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  dates: any;
  filteredDates: any;
  tournaments: any;
  showModal = false;
  showGameModal = false;
  datesControl: FormControl;
  selectedTournament: any;
  selectedFilterTournament: any = null;
  datesSelected: any[] = [];
  sortColumn: string = 'date';
  sortDirection: string = 'asc';
  sortDirectionDate: string = 'asc';
  sortDirectionId: string = 'asc';
  fields: any[] = [];
  loading: boolean = false;
  
  selectedDate: any = null;
  games: Game[] = [];
  gamesLoading: boolean = false;
  gameForm: FormGroup;
  isEditingGame: boolean = false;
  currentGameId: number | null = null;
  categoryTags: Set<string> = new Set();
  allTeams: any[] = [];
  referees: any[] = [];

  urlEnvironment = environment.apiEndpoint;
  
  constructor(
    private tournamentsService: TournamentService, 
    private adminService: AdminService,
    private dateService: DateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.datesControl = new FormControl('', Validators.required);
    
    this.gameForm = this.fb.group({
      hour: ['', Validators.required],
      tournament: [null],
      team_1: [null, Validators.required],
      team_2: [null, Validators.required],
      field: [null],
      observer: [null],
      referee: [null]
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.urlEnvironment = environment.apiEndpoint.replace('/api/', '');

    await this.getTournaments();
    this.getAllTeams();
    await this.getFields();
    await this.getReferees();

    if (this.tournaments.length) {
      await this.getDates();
    }
    this.loading = false;
  }

  async getReferees() {
    const response = await this.adminService.getReferees();
    this.referees = response;
  }

  async getFields() {
    const response = await this.tournamentsService.getFields();
    this.fields = response;
  }

  async getDates() {
    const response = await this.tournamentsService.getDates();

    this.dates = response.map((date: any) => {
      const tournamentNames = date.tournament.map((id: number) => {
        const found = this.tournaments.find((t: any) => t.id === id);
        return found ? found.name : 'Torneo no encontrado';
      });
      
      return {
        id: date.id,
        date: date.date,
        active: date.active,
        tournament: tournamentNames.join(' - '),
        tournamentIds: date.tournament
      }
    });

    this.dates.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.filteredDates = [...this.dates];
  }

  async getTournaments() {
    const tournaments = await this.adminService.getTournaments();
    this.tournaments = tournaments.map((tournament: any) => {
      return {
        id: tournament.id,
        name: tournament.name,
      }
    });
  }

  async getAllTeams() {
    try {
      const teams = await this.adminService.getTeams();
      this.allTeams = teams.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error loading teams:', error);
      this.toastr.error('Error loading teams');
    }
  }

  filterDatesByTournament() {
    if (!this.selectedFilterTournament) {
      this.filteredDates = [...this.dates];
      return;
    }
    
    this.filteredDates = this.dates.filter((date: any) => 
      date.tournamentIds.includes(parseInt(this.selectedFilterTournament))
    );
  }

  resetFilter() {
    this.selectedFilterTournament = null;
    this.filteredDates = [...this.dates];
  }

  openNewDateModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.datesSelected = [];
    this.datesControl.reset();
  }

  addDate() {
    this.datesSelected.push({
      index: this.datesSelected.length + 1,
      date: this.datesControl.value,
      tournament: this.selectedTournament
    });

    this.datesControl.reset();
  }

  removeDate(index: number) {
    this.datesSelected.splice(index, 1);
  }

  async createDates() {
    if (!this.datesSelected || this.datesSelected.length === 0) {
      this.toastr.error('Debe seleccionar al menos una fecha');
      return;
    }

    const listDate = this.datesSelected.map((date: any) => ({
      date: date.date,
      tournament: [date.tournament],
      active: true
    }));

    try {
      this.loading = true;
      await this.tournamentsService.addDates(listDate);
      this.datesSelected = [];
      this.datesControl.reset();
      this.toastr.success('Fechas creadas correctamente');
      this.showModal = false;
      await this.getDates();
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  async deleteDate(index: number, id: number) {
    try {
      this.loading = true;
      await this.tournamentsService.deleteDate(id.toString());
      this.dates.splice(index, 1);
      this.filteredDates = [...this.dates];
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  sortDates(column: string) {
    if (this.sortColumn === column) {
      this.sortDirectionDate = this.sortDirectionDate === 'asc' ? 'desc' : 'asc';
      this.filteredDates.sort((a: any, b: any) => {
        const multiplier = this.sortDirectionDate === 'asc' ? 1 : -1;
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    }
    this.sortColumn = column;
  }

  sortDatesId(column: string) {
    if (this.sortColumn === column) {
      this.sortDirectionId = this.sortDirectionId === 'asc' ? 'desc' : 'asc';
      this.filteredDates.sort((a: any, b: any) => {
        const multiplier = this.sortDirectionId === 'asc' ? 1 : -1;
        return multiplier * (a[column] - b[column]);
      });
    }
    this.sortColumn = column;
  }

  viewGames(date: any) {
    this.selectedDate = date;
    this.gamesLoading = true;
    
    this.dateService.getGamesByDate(date.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.gamesLoading = false; })
      )
      .subscribe({
        next: (games) => {
          this.games = games;
          this.categoryTags = new Set();
          
          games.forEach(game => {
            if (game.team_1?.category) this.categoryTags.add(game.team_1.category);
            if (game.team_2?.category) this.categoryTags.add(game.team_2.category);
          });
        },
        error: (error) => {
          console.error('Error loading games:', error);
          this.toastr.error('Error cargando los juegos');
        }
      });
  }
  
  openGameModal(game?: Game) {
    this.gameForm.reset();
    this.gamesLoading = false;
    
    if (game) {
      this.isEditingGame = true;
      this.currentGameId = game.id || null;
      
      this.gameForm.patchValue({
        hour: game.hour,
        tournament: game.tournament,
        team_1: game.team_1.id,
        team_2: game.team_2.id,
        field: game.field,
        observer: game.observer,
        referee: game.referee || null
      });
    } else {
      this.isEditingGame = false;
      this.currentGameId = null;
      
      this.gameForm.patchValue({
        tournament: this.selectedDate.tournamentIds[0] || null,
        field: null,
        observer: null,
        referee: null
      });
    }
    
    this.gameForm.markAsUntouched();
    this.gameForm.markAsPristine();
    this.showGameModal = true;
  }
  
  closeGameModal() {
    this.showGameModal = false;
    this.gameForm.reset();
    this.gamesLoading = false;
  }
  
  saveGame() {
    if (this.gameForm.invalid) {
      this.gameForm.markAllAsTouched();
      this.toastr.error('Por favor complete todos los campos requeridos');
      return;
    }
    
    const formValues = this.gameForm.value;
    const { team_1: team1, team_2: team2 } = formValues;
    
    if (!team1 || !team2) {
      this.toastr.error('Equipos no encontrados');
      return;
    }
    
    const gameData: Game = {
      hour: formValues.hour,
      date: this.selectedDate.id,
      tournament: formValues.tournament,
      team_1: team1,
      team_2: team2,
      field: formValues.field,
      observer: formValues.observer,
      referee: formValues.referee,
      result: null
    };
    
    this.gamesLoading = true;
    
    if (this.isEditingGame && this.currentGameId) {
      this.dateService.updateGame(this.currentGameId, gameData).subscribe({
        next: () => {
          this.toastr.success('Partido actualizado correctamente');
          this.viewGames(this.selectedDate);
          this.closeGameModal();
        },
        error: (err) => {
          console.error('Error al actualizar el partido:', err);
          this.toastr.error('Error al actualizar el partido');
        },
        complete: () => {
          this.gamesLoading = false;
        }
      });
    } else {
      this.dateService.createGame([gameData]).subscribe({
        next: () => {
          this.toastr.success('Partido creado correctamente');
          this.viewGames(this.selectedDate);
          this.closeGameModal();
        },
        error: (err) => {
          console.error('Error al crear el partido:', err);
          this.toastr.error('Error al crear el partido');
        },
        complete: () => {
          this.gamesLoading = false;
        }
      });
    }
  }
  
  deleteGame(gameId: number) {
    if (confirm('¿Está seguro que desea eliminar este partido?')) {
      this.gamesLoading = true;
      
      this.dateService.deleteGame(gameId)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => { this.gamesLoading = false; })
        )
        .subscribe({
          next: () => {
            this.toastr.success('Partido eliminado correctamente');
            this.viewGames(this.selectedDate);
          },
          error: (err) => {
            console.error('Error al eliminar el juego:', err);
            this.toastr.error('Error al eliminar el partido');
          }
        });
    }
  }
  
  backToDatesList() {
    this.selectedDate = null;
    this.games = [];
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
