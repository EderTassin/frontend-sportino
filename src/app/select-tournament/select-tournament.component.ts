import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Tournament {
  id: number;
  name: string;
  description: string;
  image: string;
  year: number;
  isActive: boolean;
}

@Component({
  selector: 'app-select-tournament',
  templateUrl: './select-tournament.component.html',
  styleUrls: ['./select-tournament.component.scss']
})

export class SelectTournamentComponent implements OnInit {
  tournaments: Tournament[] = [
    {
      id: 1,
      name: 'Torneo Apertura 2024',
      description: 'El torneo de apertura de la temporada 2024, con equipos de todo el país compitiendo por el título.',
      image: 'https://library.sportingnews.com/styles/twitter_card_120x120/s3/2022-11/Liga%20Profesional%20Argentina%20AFA%20LPF.jpg?itok=co02_pTs',
      year: 2024,
      isActive: true
    },
    {
      id: 2,
      name: 'Copa Invierno 2024',
      description: 'Un torneo especial de invierno, con partidos emocionantes y equipos compitiendo en condiciones desafiantes.',
      image: 'https://pbs.twimg.com/media/GMWWjH9W0AA6W3l.jpg',
      year: 2024,
      isActive: false
    },
    {
      id: 3,
      name: 'Torneo Clausura 2024',
      description: 'El torneo de clausura de la temporada 2024, donde los equipos buscan terminar la temporada en la cima.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScY6eg1qQwdvOjOrBra2z4q1LwDQowcVNqZw&s',
      year: 2024,
      isActive: true
    },
    {
      id: 4,
      name: 'Copa Verano 2025',
      description: 'La copa de verano para la próxima temporada, con partidos amistosos y competiciones de pretemporada.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPz4DyUrZ979I8ZyZOUCXPZB-NTcDhrG7vfQ&s',
      year: 2025,
      isActive: true
    }
  ];

  filteredTournaments: Tournament[] = [];
  selectedYear: number | null = null;
  showActiveOnly: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filterTournaments();
  }

  filterTournaments(): void {
    this.filteredTournaments = this.tournaments.filter(tournament => {
      return (!this.selectedYear || tournament.year === this.selectedYear) &&
             (!this.showActiveOnly || tournament.isActive);
    });
  }

  selectTournament(tournament: Tournament): void {
    this.router.navigate(['/match-statistics', tournament.id]);
  }
}
