import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent {

  tournaments: any;
  tournamentsOriginal: any;
  filter: any;

  constructor(private router: Router, private tournamentsService: AdminService) { }


  ngOnInit(): void {
    this.getTournaments();
  }


  getTournaments() {
    this.tournamentsService.getTournaments().subscribe((tournaments) => {
      this.tournaments = tournaments;
      this.tournamentsOriginal = tournaments;
    });
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
}
