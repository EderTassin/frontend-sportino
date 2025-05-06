import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, Tournament } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { SubTournamentDialogComponent } from './sub-tournament-dialog/sub-tournament-dialog.component';

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
      
      // Reset maps
      this.tournamentMap.clear();
      this.subTournaments.clear();
      
      // Create a map of all tournaments by ID for quick lookup
      tournaments.forEach((tournament: any) => {
        this.tournamentMap.set(tournament.id, tournament);
      });
      
      // Organize tournaments into parent-child relationships
      tournaments.forEach((tournament: any) => {
        if (tournament.parent) {
          // This is a sub-tournament
          if (!this.subTournaments.has(tournament.parent)) {
            this.subTournaments.set(tournament.parent, []);
          }
          this.subTournaments.get(tournament.parent)?.push(tournament);
        }
      });
      
      // Filter out only parent tournaments (those without a parent)
      this.tournaments = tournaments.filter((tournament: any) => !tournament.parent);
      this.tournamentsOriginal = [...this.tournaments];
      
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
    this.router.navigate(['/create-tournament']);
  }

  editTournament(id: number) {
    this.router.navigate(['/create-tournament', id]);
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
    this.router.navigate(['/admin/tournament-summary/', id]);
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
