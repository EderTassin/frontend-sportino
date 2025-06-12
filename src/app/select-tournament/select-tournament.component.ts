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
  bgColor?: string;
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
    this.assignBackgroundColors();
    this.populateYears();
  }

  assignBackgroundColors(): void {
    const elegantColors = [
      '#0D3B66', // Azul marino
      '#1A5E63', // Verde azulado
      '#2E6E65', // Verde bosque
      '#3D5A80', // Azul acero
      '#5D4A66', // Púrpura oscuro
      '#6A3937', // Borgoña
      '#2C5530', // Verde oliva
      '#4A5859', // Gris pizarra
      '#264653', // Azul petróleo
      '#1B3A4B', // Azul noche
      '#3F4E4F', // Gris verdoso
      '#553939', // Marrón oscuro
    ];
    
    this.tournaments.forEach((tournament, index) => {
      tournament.bgColor = elegantColors[index % elegantColors.length];
    });
  }

  populateYears(): void {
    const yearsSet = new Set<number>();
    this.tournaments.forEach(tournament => {
      const year = new Date(tournament.date_from).getFullYear();
      yearsSet.add(year);
    });
    this.years = Array.from(yearsSet).sort((a, b) => a - b);
    this.filterTournaments();
  }

  filterTournaments() {
    const selectedYear = this.selectedYear !== null ? Number(this.selectedYear) : null;
    this.filteredTournaments = [];
    if (selectedYear) {
      this.filteredTournaments = this.tournaments.filter((tournament) =>  
        new Date(tournament.date_from).getFullYear() === selectedYear ||
        new Date(tournament.date_to).getFullYear() === selectedYear 
    );
    }else{
      this.filteredTournaments = this.tournaments;
    }
  }

  selectTournament(tournament: Tournament): void {
    this.router.navigate(['/match-statistics', tournament.id]);
  }
}
