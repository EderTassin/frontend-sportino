import { Component } from '@angular/core';
import { TournamentService } from 'src/app/create-tournaments/service/tournament.service';
import { AdminService } from '../service/admin.service';
import { trigger, transition, style, animate } from '@angular/animations';

interface Match {
  id: number;
  localTeam: string;
  visitorTeam: string;
  date: Date;
  tournamentId: number;
}

interface Player {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

interface Sanction {
  id: number;
  type: string;
  reason: string;
  playerId: number;
  teamId: number;
  player?: Player;
  team?: Team;
  missedDates: number;
  yellowCards: string;
  redCard: string;
}

interface Goal {
  id: number;
  matchId: number;
  teamId: number;
  player: Player;
  minute: number;
  goals: Goal[];
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ResultsComponent {
  selectedTournament: number = 0;
  selectedDate: number = 0;
  selectedMatchId: number | null = null;

  goals: Goal[] = [];
  sanctions: Sanction[] = [];

  players = [
    { id: 1, name: 'Jugador 1' },
    { id: 2, name: 'Jugador 2' },
    { id: 3, name: 'Jugador 3' }
  ];

  newSanction: Sanction = {
    id: 0,
    type: 'P',
    reason: '',
    playerId: 0,
    teamId: 0,
    missedDates: 0,
    yellowCards: '0',
    redCard: '0'
  };

  newGoal: Goal = {
    id: 0,
    matchId: 0,
    teamId: 0,
    player: { id: 0, name: '' },
    minute: 0,
    goals: []
  };
  
  tournaments = [
    { id: 1, name: 'Torneo Apertura 2023' },
    { id: 2, name: 'Torneo Clausura 2024' }
  ];

  dates: any;
  matches: any;
  constructor( private tournamentService: TournamentService, private adminService: AdminService) {}


  ngOnInit(): void {
    this.getTournaments();
  }

  async getTournaments(){
    this.tournaments = await this.adminService.getTournaments();
  }

  onTournamentChange(): void {
    this.getDates();
  }

  onDateChange(): void {
    this.getMatches();
  }


  toggleMatch(matchId: number): void {
    this.selectedMatchId = this.selectedMatchId === matchId ? null : matchId;
  }

  async getDates(){
    this.dates = await this.tournamentService.getDatesByTournament(this.selectedTournament);
  }

  async getMatches(){
    this.matches = await this.tournamentService.getMatchesByDate(this.selectedDate);
  }

  addGoal(id: number): void {
  }

  addSanction(id: number): void {
  }

  removeGoal(goal: Goal): void {
    this.goals = this.goals.filter(g => g !== goal);
  }

  removeSanction(sanction: Sanction): void {
    this.sanctions = this.sanctions.filter(s => s.id !== sanction.id);
  }
}
