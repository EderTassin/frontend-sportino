import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EstadisticaPartidosService } from '../home/tabla-fixture/service/estadistica-partidos.service';

interface Tournament {
  id: number;
  name: string;
  date_from: string;
  date_to: string;
  active: boolean;
  image: string;
  category: number[];
}

@Component({
  selector: 'app-select-tournament',
  templateUrl: './select-tournament.component.html',
  styleUrls: ['./select-tournament.component.scss']
})
export class SelectTournamentComponent implements OnInit {
  
  filteredTournaments: Tournament[] = [];
  tournaments: Tournament[] = [];
  years: number[] = [];
  selectedYear: number | null = null;
  selectedDateFrom: string | null = null;
  showActiveOnly: boolean = true;

  constructor(private router: Router, private estadisticaPartidosService: EstadisticaPartidosService) { }

  async ngOnInit() {
    await this.getTournaments();
  }

  async getTournaments(): Promise<void> {
    this.tournaments = await this.estadisticaPartidosService.getTournament();
    this.filterTournaments();
    this.populateYears();
  }

  populateYears(): void {
    const yearsSet = new Set<number>();
    this.tournaments.forEach(tournament => {
      const year = new Date(tournament.date_from).getFullYear();
      yearsSet.add(year);
    });
    this.years = Array.from(yearsSet).sort((a, b) => a - b);
  }

  filterTournaments() {
    const selectedYear = this.selectedYear !== null ? Number(this.selectedYear) : null;
  
    console.log(selectedYear);

    if (selectedYear) {
      this.filteredTournaments = this.tournaments;
      return;
    }

    this.filteredTournaments = this.tournaments.filter((tournament) => {
      const date = new Date(tournament.date_from);
      return date.getFullYear() === selectedYear;
    });
  }

  selectTournament(tournament: Tournament): void {
    this.router.navigate(['/match-statistics', tournament.id]);
  }
}
