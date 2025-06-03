import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService, Tournament } from '../../service/admin.service';
import { CategoriesService, Category } from '../../service/categories.service';
import { DateService, Game } from '../../service/date.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

interface TournamentDate {
  id: number;
  date: string; 
  active: boolean;  
  tournament: number[];
}

@Component({
  selector: 'app-tournament-preview',
  templateUrl: './tournament-preview.component.html',
  styleUrls: ['./tournament-preview.component.scss']
})
export class TournamentPreviewComponent implements OnInit {
  tournament: Tournament | null = null;
  categories: Category[] = [];
  dates: TournamentDate[] = [];
  games: Game[] = [];
  subTournaments: Tournament[] = [];
  
  isLoading = true;
  datesLoading = false;
  gamesLoading = false;
  categoriesLoading = false;
  subTournamentsLoading = false;
  
  activeTab = 'info'; // 'info', 'dates', 'games', 'subTournaments'
  selectedDateId: number | null = null;

  constructor(
    private adminService: AdminService,
    private categoriesService: CategoriesService,
    private dateService: DateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TournamentPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tournamentId: number }
  ) {}

  ngOnInit(): void {
    this.loadTournamentData();
  }

  loadTournamentData(): void {
    this.isLoading = true;
    
    this.adminService.getTournamentById(this.data.tournamentId)
      .then(tournament => {
        this.tournament = tournament;
        this.loadRelatedData();
      })
      .catch(error => {
        console.error('Error loading tournament:', error);
        this.toastr.error('Error al cargar el torneo');
        this.isLoading = false;
      });
  }

  loadRelatedData(): void {
    if (!this.tournament) return;
    
    this.categoriesLoading = true;
    this.datesLoading = true;
    this.subTournamentsLoading = true;
    
    // Cargar categorías
    this.categoriesService.getAllCategories().pipe(
      catchError(error => {
        console.error('Error loading categories:', error);
        return of([]);
      })
    ).subscribe(categories => {
      this.categories = categories;
      this.categoriesLoading = false;
      this.checkLoadingComplete();
    });
    
    // Cargar fechas y sub-torneos en paralelo
    this.loadTournamentDates();
    this.loadSubTournaments();
  }
  
  loadTournamentDates(): void {
    if (!this.tournament) return;
    
    this.adminService.getDatesByTournament(this.data.tournamentId)
      .then(response => {
        // Guardamos las fechas del torneo
        this.dates = response;
        
        this.datesLoading = false;
        
        if (this.dates.length > 0) {
          this.selectDate(this.dates[0].id);
        } else {
          this.gamesLoading = false;
        }
        
        this.checkLoadingComplete();
      })
      .catch(error => {
        console.error('Error loading dates:', error);
        this.datesLoading = false;
        this.gamesLoading = false;
        this.checkLoadingComplete();
      });
  }
  
    loadSubTournaments(): void {
    this.adminService.getTournaments()
      .then(tournaments => {
        this.subTournaments = tournaments.filter((t: Tournament) => t.parent === this.data.tournamentId);
        this.subTournamentsLoading = false;
        this.checkLoadingComplete();
      })
      .catch(error => {
        console.error('Error loading sub-tournaments:', error);
        this.subTournamentsLoading = false;
        this.checkLoadingComplete();
      });
  }
  
  checkLoadingComplete(): void {
    if (!this.categoriesLoading && !this.datesLoading && !this.subTournamentsLoading) {
      this.isLoading = false;
    }
  }

  selectDate(dateId: number): void {
    this.selectedDateId = dateId;
    this.loadGamesForDate(dateId);
  }

  loadGamesForDate(dateId: number): void {
    this.gamesLoading = true;
    this.games = [];
    
    // Obtenemos la fecha seleccionada para filtrar los juegos
    const selectedDate = this.dates.find(d => d.id === dateId);
    if (!selectedDate) {
      this.gamesLoading = false;
      return;
    }
    
    // Usamos el servicio de fechas para obtener los partidos de esta fecha específica
    this.dateService.getGamesByDate(dateId).subscribe(
      games => {
        this.games = games;
        this.gamesLoading = false;
      },
      error => {
        console.error('Error loading games:', error);
        this.toastr.error('Error al cargar los partidos');
        this.gamesLoading = false;
      }
    );
  }

  getCategoryNames(): string {
    if (!this.tournament?.category || this.tournament.category.length === 0) {
      return 'N/A';
    }
    
    return this.tournament.category
      .map((categoryId: number) => {
        const category = this.categories.find(cat => cat.id === categoryId);
        return category ? category.name : `ID: ${categoryId}`;
      })
      .join(', ');
  }
  
  getCategoryNamesForTournament(categoryIds: number[]): string {
    if (!categoryIds || categoryIds.length === 0) {
      return 'N/A';
    }
    
    return categoryIds
      .map((categoryId: number) => {
        const category = this.categories.find(cat => cat.id === categoryId);
        return category ? category.name : `ID: ${categoryId}`;
      })
      .join(', ');
  }
  
  getSelectedDateString(): string {
    if (!this.selectedDateId) return '';
    
    const selectedDate = this.dates.find(d => d.id === this.selectedDateId);
    return selectedDate ? this.formatDate(selectedDate.date) : '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5); 
  }

  close(): void {
    this.dialogRef.close();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
