import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstadisticaPartidosService } from '../home/tabla-fixture/service/estadistica-partidos.service';

interface RackingVallaMenosVencida {
  name: string;
  logo_file: string;
  golesAFavor: number;
  golesEnContra: number;
}
@Component({
  selector: 'app-match-statistics',
  templateUrl: './match-statistics.component.html',
  styleUrls: ['./match-statistics.component.scss']
})



export class MatchStatisticsComponent {
  tournamentId: number = 0;
  filterDate: string = '';
  filterCategory: string = '';
  showModal = false;
  selectedMatch: any;
  activeTab = 'team1';
  fixture: any;
  fixtureFilter: any;
  datesSelects: any;
  goleadores: any;
  selectedDate: any;
  listPosicion: any;
  tournament: any;
  environment: any;
  rackingVallaMenosVencida: RackingVallaMenosVencida[] = [];

  constructor(private route: ActivatedRoute, private estadisticaPartidosService: EstadisticaPartidosService) { }

  ngOnInit(): void {
    this.tournamentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDataForm();
  }
  
  async loadDataForm(){
    this.tournament = await this.estadisticaPartidosService.getTournamentById(this.tournamentId)
    
    const dates = await this.estadisticaPartidosService.getDatesTournaments();
    this.datesSelects = dates.filter((item:any) => item.tournament.includes(this.tournamentId))
    this.selectedDate = this.datesSelects[0].date;

    const allData = await this.estadisticaPartidosService.getCalendarsWidgets(this.tournamentId);
    
    this.fixture = allData.fixture;
    this.goleadores = allData.goleadores.slice(0,16);

    this.listPosicion = await this.estadisticaPartidosService.getPosiciones(this.tournamentId);

    this.rackingVallaMenosVencida = this.listPosicion.positions.map((item:any) => {
      return {
        name: item.team,
        logo_file: item.logo_file,
        golesAFavor: item.goals_in_favor,
        golesEnContra: item.goals_against,
      }
    }).sort((a:any, b:any) => a.golesEnContra - b.golesEnContra);

    this.filterMatchesByDate();
  }

  defaultImage(event: any): void {
    event.target.src = 'https://img.freepik.com/vector-premium/plantilla-vector-icono-forma-escudo_917138-353.jpg';
  }

  async openModal(match: any) {
    this.selectedMatch = await this.estadisticaPartidosService.getMatchDetail(match.id);

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
  
  filterMatchesByDate() {
    this.fixtureFilter = this.fixture.filter( (item:any) => item.date === this.selectedDate);
  }
  
  calculateBarWidth(golesEnContra: number): string {
    // Encontrar el máximo de goles en contra para normalizar
    const maxGoles = Math.max(...this.rackingVallaMenosVencida.map(team => team.golesEnContra));
    // Invertir la escala: menos goles = barra más larga
    const porcentaje = maxGoles > 0 ? 100 - ((golesEnContra / maxGoles) * 100) + 20 : 100;
    // Asegurar que la barra tenga al menos un 20% de ancho para visibilidad
    return `${Math.max(20, Math.min(100, porcentaje))}%`;
  }
}
