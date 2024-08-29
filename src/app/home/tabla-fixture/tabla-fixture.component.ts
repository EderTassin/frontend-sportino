import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EstadisticaPartidosService } from './service/estadistica-partidos.service';
import { Router } from '@angular/router';

interface Result {
  goals_team_1: number;
  goals_team_2: number;
}

interface Match {
  id: number;
  date: string;
  hour: string;
  team_1: Team;
  team_1_logo: string;
  team_2: Team;
  team_2_logo: string;
  field: number;
  result: Result;
}

interface Team{
  name: string;
  id: number;
  category: string;
}

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
  selector: 'app-tabla-fixture',
  templateUrl: './tabla-fixture.component.html',
  styleUrls: ['./tabla-fixture.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class TablaFixtureComponent implements OnInit {

  listPosicion: any;
  listFilterPosicion:any;
  selectedTab: string = 'Fixture';
  defaultLogo: string = 'https://static.vecteezy.com/system/resources/previews/000/356/368/non_2x/leader-of-group-vector-icon.jpg';
  selectedTournament: any;
  listFixture: Match[] = [];
  listGoleadores: any;
  listTournament: Tournament[] = [];

  constructor(private serviceEstadistica:EstadisticaPartidosService,private router: Router) { }

  ngOnInit() {
    this.loadData()
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  defaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultLogo;
  }

  async loadData(){
    this.listTournament = await this.serviceEstadistica.getTournament();
    const firstValueId = this.listTournament[0].id
    this.selectedTournament = 39;
    this.listPosicion = await this.serviceEstadistica.getPosiciones(39);

    const res = await this.serviceEstadistica.getCalendarsWidgets(39);
    this.listFixture = res.fixture.slice(0,5);
    this.listGoleadores =  res.goleadores.slice(0,16);
  }

  selectTournament(tournament: number): void {
    this.router.navigate(['/match-statistics', tournament]);
  }

  async searchTournament(){
    this.listPosicion = await this.serviceEstadistica.getPosiciones(this.selectedTournament);

    const res = await this.serviceEstadistica.getCalendarsWidgets(this.selectedTournament);
    this.listFixture = res.fixture.slice(0,5);
    this.listGoleadores =  res.goleadores.slice(0,16);
  }
}
