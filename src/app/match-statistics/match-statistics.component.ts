import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstadisticaPartidosService } from '../home/tabla-fixture/service/estadistica-partidos.service';

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
    this.goleadores = allData.goleadores.slice(0,16);

    this.listPosicion = await this.estadisticaPartidosService.getPosiciones(Number(this.tournamentId));
    
    this.filterMatchesByDate();
  }

  defaultImage(event: any): void {
    event.target.src = 'https://img.freepik.com/vector-premium/plantilla-vector-icono-forma-escudo_917138-353.jpg';
  }

  async openModal(match: any) {
    console.log(match);
    this.selectedMatch = await this.estadisticaPartidosService.getMatchDetail(match.id);

    console.log(this.selectedMatch);

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
