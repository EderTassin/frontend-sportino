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
      this.tournamentMap.clear();
      this.subTournaments.clear();
      
      sortedTournaments.forEach((tournament: any) => {
        this.tournamentMap.set(tournament.id, tournament);
      });
      sortedTournaments.forEach((tournament: any) => {
        if (tournament.parent) {
          if (!this.subTournaments.has(tournament.parent)) {
            this.subTournaments.set(tournament.parent, []);
          }
          this.subTournaments.get(tournament.parent)?.push(tournament);
        }
      }); 
      this.tournaments = sortedTournaments.filter((tournament: any) => !tournament.parent);
      this.tournamentsOriginal = [...sortedTournaments];
      
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

  createSubTournament(parentId: number) {
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
          
          this.getTournaments();
        } catch (error) {
          console.error('Error creating sub-tournament:', error);
          this.toastr.error('Error al crear el sub-torneo');
        }
      }
    });
  }
  
  hasSubTournaments(tournamentId: number): boolean {
    return this.subTournaments.has(tournamentId) && 
           this.subTournaments.get(tournamentId)!.length > 0;
  }
  
  getSubTournaments(tournamentId: number): any[] {
    return this.subTournaments.get(tournamentId) || [];
  }
}
