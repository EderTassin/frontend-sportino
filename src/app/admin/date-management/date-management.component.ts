import { Component } from '@angular/core';
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
export class DateManagementComponent {

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
    await this.getAllTeams();

    this.getReferees();
    if (this.tournaments.length) {
      await this.getDates();
    }
    this.loading = false;
  }

  async getReferees() {
    const response = await this.adminService.getReferees();
    this.referees = response;
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
      this.allTeams = teams;
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
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  async deleteDate(index: number, id: number) {
    try {
      this.loading = true;
      await this.tournamentsService.deleteDate(id.toString());
      this.dates.splice(index, 1);
      this.filteredDates = [...this.dates];
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  sortDates(column: string) {
    if (this.sortColumn === column) {
      this.sortDirectionDate = this.sortDirectionDate === 'asc' ? 'desc' : 'asc';
      this.filteredDates.sort((a: any, b: any) => {
        if (this.sortDirectionDate === 'asc') {
          return a.id - b.id;
        } else {
          return b.id - a.id;
        }
      });
    } else {
      this.sortColumn = column;
    }
  }

  sortDatesId(column: string) {
    if (this.sortColumn === column) {
      this.sortDirectionId = this.sortDirectionId === 'asc' ? 'desc' : 'asc';
      this.filteredDates.sort((a: any, b: any) => {
        if (this.sortDirectionId === 'asc') {
          return a[column] - b[column];
        } else {
          return b[column] - a[column];
        }
      });
    } else {
      this.sortColumn = column;
    }
  }

  async viewGames(date: any) {
    this.selectedDate = date;
    this.gamesLoading = true;
    
    try {
      this.dateService.getGamesByDate(date.id).subscribe(games => {
        this.games = games;
        this.categoryTags = new Set();
        
        games.forEach(game => {
          if (game.team_1?.category) this.categoryTags.add(game.team_1.category);
          if (game.team_2?.category) this.categoryTags.add(game.team_2.category);
        });
        
        this.gamesLoading = false;
      });
    } catch (error) {
      console.error('Error loading games:', error);
      this.toastr.error('Error loading games');
      this.gamesLoading = false;
    }
  }
  
  openGameModal(game?: Game) {
    this.gameForm.reset();
    this.gamesLoading = false;
    
    if (game) {
      this.isEditingGame = true;
      this.currentGameId = game.id || null;

      console.log(game);

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
    this.gamesLoading = false; // Ensure loading state is reset when closing the modal
  }
  
  saveGame() {
    if (this.gameForm.invalid) {
      this.gameForm.markAllAsTouched();
      this.toastr.error('Por favor complete todos los campos requeridos');
      return;
    }
    
    const formValues = this.gameForm.value;
    
    const team1 = formValues.team_1;
    const team2 = formValues.team_2;
    
    if (!team1 || !team2) {
      this.toastr.error('Equipos no encontrados');
      return;
    }
    
    const gameData: Game[] = [{
      hour: formValues.hour,
      date: this.selectedDate.id,
      tournament: formValues.tournament,
      team_1: team1,
      team_2: team2,
      field: formValues.field,
      observer: formValues.observer,
      referee: formValues.referee,
      result: null
    }];
    
    this.gamesLoading = true;
    
    if (this.isEditingGame && this.currentGameId) {
      const data = gameData[0];
      this.dateService.updateGame(this.currentGameId, data).subscribe({
        next: () => {
          this.toastr.success('Partido actualizado correctamente');
          this.viewGames(this.selectedDate); 
          this.closeGameModal();
          this.gamesLoading = false;
        },
        error: (err) => {
          console.error('Error updating game:', err);
          this.toastr.error('Error al actualizar el partido');
          this.gamesLoading = false;
        }
      });
    } else {
      // Create new game
      this.dateService.createGame(gameData).subscribe({
        next: () => {
          this.toastr.success('Partido creado correctamente');
          this.viewGames(this.selectedDate); 
          this.closeGameModal();
          this.gamesLoading = false;
        },
        error: (err) => {
          console.error('Error creating game:', err);
          this.toastr.error('Error al crear el partido');
          this.gamesLoading = false;
        }
      });
    }
  }
  
  deleteGame(gameId: number) {
    if (confirm('¿Está seguro que desea eliminar este partido?')) {
      this.gamesLoading = true;
      
      this.dateService.deleteGame(gameId).subscribe({
        next: () => {
          this.toastr.success('Partido eliminado correctamente');
          this.viewGames(this.selectedDate); 
          this.gamesLoading = false;
        },
        error: (err) => {
          console.error('Error deleting game:', err);
          this.toastr.error('Error al eliminar el partido');
          this.gamesLoading = false;
        }
      });
    }
  }
  
  backToDatesList() {
    this.selectedDate = null;
    this.games = [];
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
