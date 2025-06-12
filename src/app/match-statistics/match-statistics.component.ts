import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstadisticaPartidosService } from '../home/tabla-fixture/service/estadistica-partidos.service';
import { environment } from 'src/environments/environment.prod';

interface RackingVallaMenosVencida {
  name: string;
  logo_file: string;
  golesAFavor: number;
  golesEnContra: number;
}

interface Goleador {
  player_full_name: string;
  goals: number;
  team_name?: string; // Optional as it's used with *ngIf in template
  team_logo_file?: string; // Optional
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
  sanctions: any;
  sanctionDate: any;
  goleadores: Goleador[] = [];
  selectedDate: any;
  listPosicion: any;
  tournament: any;
  environment: any;
  rackingVallaMenosVencida: RackingVallaMenosVencida[] = [];

  constructor(private route: ActivatedRoute, private estadisticaPartidosService: EstadisticaPartidosService) {}

  ngOnInit(): void {
    this.tournamentId = Number(this.route.snapshot.paramMap.get('id'));
    this.environment = environment.apiEndpoint.replace('/api/', '');
    this.loadDataForm();
  }
  
  async loadDataForm(){
    this.tournament = await this.estadisticaPartidosService.getTournamentById(this.tournamentId)
    
    const dates = await this.estadisticaPartidosService.getDatesTournaments();
    this.datesSelects = dates.filter((item:any) => item.tournament.includes(this.tournamentId))
    this.datesSelects.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.selectedDate = this.datesSelects[0].date;
    this.sanctionDate = this.datesSelects[0].id;

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
    
    this.getSanctions();
    this.filterMatchesByDate();
  }

  async getSanctions(){
    let query = "?tournament=" + this.tournamentId;
    if(this.sanctionDate){
      query += "&gamedate_id=" + this.sanctionDate;
    }
    this.sanctions = await this.estadisticaPartidosService.getSanctions(query);
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
  
  calculateBarWidth(value: number, isInverseScale: boolean): string {
    let maxValue: number;
    let percentage: number;
    const defaultMinWidth = 10;

    if (isInverseScale) {   
      const vallaMinWidth = 20;
      if (!this.rackingVallaMenosVencida || this.rackingVallaMenosVencida.length === 0) {
        return `${value === 0 ? 100 : vallaMinWidth}%`;
      }
      
      const relevantValues = this.rackingVallaMenosVencida
        .map(team => team.golesEnContra)
        .filter(v => typeof v === 'number' && isFinite(v) && v >= 0);

      if (relevantValues.length === 0) {
          return `${value === 0 ? 100 : vallaMinWidth}%`;
      }

      maxValue = Math.max(...relevantValues);

      if (maxValue === 0) { 
          percentage = (value === 0) ? 100 : vallaMinWidth; 
      } else {
        percentage = vallaMinWidth + (1 - (value / maxValue)) * (100 - vallaMinWidth);
      }
      percentage = Math.max(vallaMinWidth, Math.min(100, percentage));

    } else { // For "Goleadores" - more is better
      const goleadoresMinWidth = defaultMinWidth;
      if (!this.goleadores || this.goleadores.length === 0) {
        return `${goleadoresMinWidth}%`;
      }

      const relevantValues = this.goleadores
        .map((scorer: Goleador) => scorer.goals)
        .filter((v: number | undefined): v is number => typeof v === 'number' && isFinite(v) && v >= 0);

      if (relevantValues.length === 0) {
          return `${goleadoresMinWidth}%`;
      }
      
      maxValue = Math.max(...relevantValues);

      if (maxValue === 0) { 
        percentage = goleadoresMinWidth; 
      } else {
        percentage = ((value / maxValue) * (100 - goleadoresMinWidth)) + goleadoresMinWidth;
      }
      percentage = Math.max(goleadoresMinWidth, Math.min(100, percentage));
    }
    
    if (isNaN(percentage) || !isFinite(percentage)) {
      percentage = isInverseScale ? (value === 0 ? 100 : 20) : defaultMinWidth;
    }

    return `${parseFloat(percentage.toFixed(2))}%`; 
  }

  dateIsBeforeNow(date: string): boolean {
    const matchDate = new Date(date);
    const now = new Date();
    return matchDate < now;
  }

  formatHour(hour: string): string {
    return hour ? hour.substring(0, 5) : '';
  }
}
