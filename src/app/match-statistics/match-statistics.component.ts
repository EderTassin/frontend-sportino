import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstadisticaPartidosService } from '../home/tabla-fixture/service/estadistica-partidos.service';

interface Match {
  homeTeam: string;
  homeLogo: string;
  homeScore: number;
  awayTeam: string;
  awayLogo: string;
  awayScore: number;
  date: string;
  time: string;
}

interface TopScorer {
  player: string;
  team: string;
  goals: number;
}

interface Standings {
  team: string;
  pts: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
}

@Component({
  selector: 'app-match-statistics',
  templateUrl: './match-statistics.component.html',
  styleUrls: ['./match-statistics.component.scss']
})

export class MatchStatisticsComponent {
  tournamentId: string | null = "";
  filterDate: string = '';
  filterCategory: string = '';
  categories: string[] = ['Categoria 1', 'Categoria 2', 'Categoria 3'];
  showModal = false;
  selectedMatch: any;
  activeTab = 'team1';

  matchesDetail = [
    {
      id: 1,
      homeTeam: 'FC Barcelona',
      awayTeam: 'Real Madrid',
      homeScore: 2,
      awayScore: 1,
      homeLogo: 'https://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/3.png',
      awayLogo: 'https://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/1.png',
      homePlayers: [
        { name: 'Messi', goals: 2, cards: 0, cardColor: '' },
        { name: 'Pique', goals: 0, cards: 1, cardColor: 'yellow' },
        { name: 'Ter Stegen', goals: 0, cards: 0, cardColor: '' },
        { name: 'Alba', goals: 0, cards: 0, cardColor: '' },
        { name: 'Busquets', goals: 0, cards: 0, cardColor: '' },
        { name: 'Suarez', goals: 0, cards: 0, cardColor: '' },
        { name: 'Griezmann', goals: 0, cards: 0, cardColor: '' },
        { name: 'Lenglet', goals: 0, cards: 0, cardColor: '' },
        { name: 'Dembele', goals: 0, cards: 0, cardColor: '' },
        { name: 'Rakitic', goals: 0, cards: 0, cardColor: '' },
        { name: 'Arthur', goals: 0, cards: 0, cardColor: '' }
      ],
      awayPlayers: [
        { name: 'Ronaldo', goals: 1, cards: 0, cardColor: '' },
        { name: 'Ramos', goals: 0, cards: 1, cardColor: 'yellow' },
        { name: 'Courtois', goals: 0, cards: 0, cardColor: '' },
        { name: 'Marcelo', goals: 0, cards: 0, cardColor: '' },
        { name: 'Casemiro', goals: 0, cards: 0, cardColor: '' },
        { name: 'Benzema', goals: 0, cards: 0, cardColor: '' },
        { name: 'Modric', goals: 0, cards: 0, cardColor: '' },
        { name: 'Kroos', goals: 0, cards: 0, cardColor: '' },
        { name: 'Isco', goals: 0, cards: 0, cardColor: '' },
        { name: 'Carvajal', goals: 0, cards: 0, cardColor: '' },
        { name: 'Varane', goals: 0, cards: 0, cardColor: '' }
      ]
    }
  ];

  topScorers: TopScorer[] = [
    { player: 'Lionel Messi', team: 'FC Barcelona', goals: 25 },
    { player: 'Cristiano Ronaldo', team: 'Juventus', goals: 23 },
    { player: 'Robert Lewandowski', team: 'Bayern Munich', goals: 22 },
    { player: 'Kylian Mbappé', team: 'Paris Saint-Germain', goals: 20 },
    { player: 'Harry Kane', team: 'Tottenham Hotspur', goals: 19 }
  ];

  standings: Standings[] = [
    { team: 'FC Barcelona', pts: 85, pj: 34, pg: 27, pe: 4, pp: 3, gf: 85, gc: 25, dg: 60 },
    { team: 'Real Madrid', pts: 81, pj: 34, pg: 25, pe: 6, pp: 3, gf: 75, gc: 20, dg: 55 },
    { team: 'Atletico Madrid', pts: 75, pj: 34, pg: 23, pe: 6, pp: 5, gf: 70, gc: 25, dg: 45 },
    { team: 'Sevilla FC', pts: 70, pj: 34, pg: 22, pe: 4, pp: 8, gf: 65, gc: 30, dg: 35 },
    { team: 'Villarreal CF', pts: 65, pj: 34, pg: 20, pe: 5, pp: 9, gf: 60, gc: 35, dg: 25 },
    { team: 'Real Sociedad', pts: 60, pj: 34, pg: 18, pe: 6, pp: 10, gf: 55, gc: 40, dg: 15 },
    { team: 'Real Betis', pts: 55, pj: 34, pg: 17, pe: 4, pp: 13, gf: 50, gc: 45, dg: 5 },
    { team: 'Athletic Bilbao', pts: 50, pj: 34, pg: 15, pe: 5, pp: 14, gf: 45, gc: 40, dg: 5 },
    { team: 'Valencia CF', pts: 45, pj: 34, pg: 13, pe: 6, pp: 15, gf: 40, gc: 45, dg: -5 },
    { team: 'Granada CF', pts: 40, pj: 34, pg: 12, pe: 4, pp: 18, gf: 35, gc: 50, dg: -15 }
  ];

  fixture: any;
  fixtureFilter: any;
  datesSelects: any;
  goleadores: any;
  selectedDate: any;
  listPosicion: any;

  constructor(private route: ActivatedRoute, private estadisticaPartidosService: EstadisticaPartidosService) { }

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.paramMap.get('id');
    this.loadDataForm();
  }
  
  filterMatchesByDate() {
    this.fixtureFilter = this.fixture.filter( (item:any) => item.date === this.selectedDate);
  }
  
  async loadDataForm(){
    const dates = await this.estadisticaPartidosService.getDatesTournaments();
    this.datesSelects = dates.filter((item:any) => item.tournament.includes(Number(this.tournamentId)))
    this.selectedDate = this.datesSelects[0].date;

    const allData = await this.estadisticaPartidosService.getCalendarsWidgets(Number(this.tournamentId));
    this.fixture = allData.fixture;
    this.goleadores = allData.goleadores;

    this.listPosicion = await this.estadisticaPartidosService.getPosiciones(Number(this.tournamentId));
    console.log(this.listPosicion);
    
    this.filterMatchesByDate();
  }

  defaultImage(event: any): void {
    event.target.src = 'https://img.freepik.com/vector-premium/plantilla-vector-icono-forma-escudo_917138-353.jpg';
  }

  openModal(match: any) {
    this.selectedMatch = this.matchesDetail[0];
    this.showModal = true;
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  closeModal() {
    this.showModal = false;
  }

  createArray(length: number): any[] {
    return new Array(length);
  }
}
