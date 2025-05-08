import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, Tournament } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { SubTournamentDialogComponent } from './sub-tournament-dialog/sub-tournament-dialog.component';
import { TournamentDialogComponent } from './tournament-dialog/tournament-dialog.component';
import { TournamentPreviewComponent } from './tournament-preview/tournament-preview.component';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {

  tournaments: any[] = [];
  tournamentsOriginal: any[] = [];
  filter: string = '';
  tournamentMap: Map<number, any> = new Map();
  subTournaments: Map<number, any[]> = new Map();

  constructor(
    private router: Router, 
    private tournamentsService: AdminService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.getTournaments();
  }


  async getTournaments() {
    try {
      const tournaments = await this.tournamentsService.getTournaments();
      
      const sortedTournaments = tournaments.sort((a: any, b: any) => b.id - a.id);
      // Reset maps
      this.tournamentMap.clear();
      this.subTournaments.clear();
      
      // Create a map of all tournaments by ID for quick lookup
      sortedTournaments.forEach((tournament: any) => {
        this.tournamentMap.set(tournament.id, tournament);
      });
      
      // Organize tournaments into parent-child relationships
      sortedTournaments.forEach((tournament: any) => {
        if (tournament.parent) {
          // This is a sub-tournament
          if (!this.subTournaments.has(tournament.parent)) {
            this.subTournaments.set(tournament.parent, []);
          }
          this.subTournaments.get(tournament.parent)?.push(tournament);
        }
      });
      
      // Filter out only parent tournaments (those without a parent)
      this.tournaments = sortedTournaments.filter((tournament: any) => !tournament.parent);
      this.tournamentsOriginal = [...sortedTournaments];
      
      console.log('Parent tournaments:', this.tournaments);
      console.log('Sub-tournaments map:', this.subTournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      this.toastr.error('Error al cargar los torneos');
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  openModal() {
    const dialogRef = this.dialog.open(TournamentDialogComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTournaments();
      }
    });
  }

  editTournament(id: number) {
    const tournament = this.tournamentMap.get(id);
    
    if (!tournament) {
      this.toastr.error('No se encontró el torneo');
      return;
    }
    
    const dialogRef = this.dialog.open(TournamentDialogComponent, {
      width: '800px',
      disableClose: true,
      data: { tournament }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTournaments();
      }
    });
  }

  applyFilter() {
    if (!this.filter || this.filter === '') {
      this.tournaments = this.tournamentsOriginal;
    }
    this.tournaments = this.tournamentsOriginal.filter((tournament: any) => {
        return tournament.name.toLowerCase().includes(this.filter.toLowerCase());
      }
    );
  }

  deleteTournament(id: number) {
    this.tournamentsService.deleteTournament(id).subscribe(() => {
      this.getTournaments();
    });
  }

  goToTournament(id: number) {
    this.openTournamentPreview(id);
  }
  
  openTournamentPreview(id: number) {
    const dialogRef = this.dialog.open(TournamentPreviewComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { tournamentId: id }
    });
  }
  
  openPreviewDialog(tournament: Tournament): void {
    this.dialog.open(TournamentPreviewComponent, {
      width: '900px',
      height: '80vh',
      maxWidth: '95vw',
      data: { tournamentId: tournament.id }
    });
  }

  /**
   * Opens a dialog to create a sub-tournament for the specified parent tournament
   * @param parentId The ID of the parent tournament
   */
  createSubTournament(parentId: number) {
    // Get the parent tournament data to pre-populate some fields
    const parentTournament = this.tournamentMap.get(parentId);
    
    if (!parentTournament) {
      this.toastr.error('No se encontró el torneo padre');
      return;
    }
    
    const dialogRef = this.dialog.open(SubTournamentDialogComponent, {
      width: '600px',
      data: {
        parentTournament: parentTournament
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          // Create the sub-tournament with the parent ID
          const subTournamentData: Partial<Tournament> = {
            name: result.name,
            description: result.description || parentTournament.description,
            date_from: result.date_from,
            date_to: result.date_to,
            category: result.category || parentTournament.category,
            active: true
          };
          
          const createdSubTournament = await this.tournamentsService.createSubTournament(parentId, subTournamentData);
          
          this.toastr.success(`Sub-torneo "${result.name}" creado con éxito`);
          
          // Refresh the tournaments list
          this.getTournaments();
        } catch (error) {
          console.error('Error creating sub-tournament:', error);
          this.toastr.error('Error al crear el sub-torneo');
        }
      }
    });
  }
  
  /**
   * Checks if a tournament has sub-tournaments
   * @param tournamentId The ID of the tournament to check
   * @returns True if the tournament has sub-tournaments, false otherwise
   */
  hasSubTournaments(tournamentId: number): boolean {
    return this.subTournaments.has(tournamentId) && 
           this.subTournaments.get(tournamentId)!.length > 0;
  }
  
  /**
   * Gets the sub-tournaments for a specific tournament
   * @param tournamentId The ID of the parent tournament
   * @returns An array of sub-tournaments
   */
  getSubTournaments(tournamentId: number): any[] {
    return this.subTournaments.get(tournamentId) || [];
  }
}
