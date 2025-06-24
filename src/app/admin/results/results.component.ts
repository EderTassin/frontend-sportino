import { Component } from '@angular/core';
import { TournamentService } from 'src/app/create-tournaments/service/tournament.service';
import { AdminService } from '../service/admin.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ManagerService } from 'src/app/manager/manager.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Team {
  id: number;
  name: string;
}

interface Sanction {
  id: number;
  matchId: number;
  type: string;
  reason: string;
  playerId: number;
  teamId: number;
  player?: any;
  team?: any;
  playerName?: string;
  missedDates: number;
  yellowCards: string;
  redCard: string;
  idPost?: number;
}

interface Goal {
  id: number;
  matchId: number;
  teamId: number;
  player: any;
  minute?: number;
  goals: number;
  playerName?: string;
  idPost?: number;
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
  playersTeam1: any[] = [];
  playersTeam2: any[] = [];

  goalsTeam1: Goal[] = [];
  goalsTeam2: Goal[] = [];
  sanctionsTeam1: Sanction[] = [];
  sanctionsTeam2: Sanction[] = [];

  newGoalTeam1: any = {
    player: 0,
    goals: 0,
    teamId: 0,
    playerName: ''
  };
  newGoalTeam2: any = {
    player: 0,
    goals: 0,
    teamId: 0,
    playerName: ''
  };
  newSanctionTeam1: Sanction = {
    id: 0,
    type: 'P',
    matchId: 0,
    reason: '',
    playerId: 0,
    teamId: 0,
    playerName: '',
    missedDates: 0,
    yellowCards: '0',
    redCard: '0'
  };
  newSanctionTeam2: Sanction = {
    id: 0,
    type: 'P',
    matchId: 0,
    reason: '',
    playerId: 0,
    teamId: 0,
    playerName: '',
    missedDates: 0,
    yellowCards: '0',
    redCard: '0'
  };
  tournaments = [
    { id: 1, name: 'Torneo Apertura 2023' },
    { id: 2, name: 'Torneo Clausura 2024' }
  ];

  dates: any;
  matches: any;
  constructor( private tournamentService: TournamentService, private adminService: AdminService, 
    private managerService: ManagerService, private router: Router
  ) {}


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


  async toggleMatch(match: any) {
    this.playersTeam1 = [];
    this.playersTeam2 = [];
    this.goalsTeam1 = [];
    this.goalsTeam2 = [];
    this.sanctionsTeam1 = [];
    this.sanctionsTeam2 = [];

    const filterGoalsTeam1 = match.goals.filter((goal: any) => goal.team.id == match.team_1.id);
    const filterGoalsTeam2 = match.goals.filter((goal: any) => goal.team.id == match.team_2.id);
    
    this.managerService.getTeam(match.team_1.id).subscribe((res: any) => {
      this.playersTeam1 = res.players;
      this.newGoalTeam1.teamId = match.team_1.id;
      this.newSanctionTeam1.teamId = match.team_1.id;

      this.goalsTeam1 =filterGoalsTeam1.map((goal: any) => ({
        playerName: this.playersTeam1.find((p: any) => p.id == goal.player).full_name,
        goals: goal.goal_number,
      }));
    });
    
    this.managerService.getTeam(match.team_2.id).subscribe((res: any) => {
      this.playersTeam2 = res.players;
      this.newGoalTeam2.teamId = match.team_2.id;
      this.newSanctionTeam2.teamId = match.team_2.id;

      this.goalsTeam2 = filterGoalsTeam2.map((goal: any) => ({
        goals: goal.goal_number,
        playerName: this.playersTeam2.find((p: any) => p.id == goal.player).full_name,
      }));
    });
    
    this.selectedMatchId = this.selectedMatchId === match.id ? null : match.id;
  }

  async getDates(){
    this.dates = await this.tournamentService.getDatesByTournament(this.selectedTournament);
  }

  async getMatches(){
    const res = await this.tournamentService.getMatchesByDate(this.selectedDate);
    this.matches = res.sort((a: any, b: any) => b.id! - a.id!).filter((match: any) => match.tournament == this.selectedTournament);
  }

  addGoal(matchId: number, teamNumber: number): void {
    if (teamNumber === 1) {
      if (!this.newGoalTeam1.player || this.newGoalTeam1.goals < 0) {
        this.showNotification('error', 'Debe seleccionar un jugador y especificar una cantidad válida de goles');
        return;
      }
      const player = this.playersTeam1.find(p => p.id == this.newGoalTeam1.player);
      const playerName = player ? player.full_name : 'Jugador desconocido';
      
      const newGoal = {
        ...this.newGoalTeam1,
        matchId: matchId,
        id: this.goalsTeam1.length + 1,
        playerName: playerName
      };

      this.createGoal(newGoal, 1);

      this.newGoalTeam1 = {
        player: 0,
        goals: 0,
        teamId: this.newGoalTeam1.teamId,
        playerName: ''
      };
    } else {
      if (!this.newGoalTeam2.player || this.newGoalTeam2.goals < 0) {
        this.showNotification('error', 'Debe seleccionar un jugador y especificar una cantidad válida de goles');
        return;
      }

      const player = this.playersTeam2.find(p => p.id === this.newGoalTeam2.player);
      const playerName = player ? player.full_name : 'Jugador desconocido';
      
      const newGoal = {
        ...this.newGoalTeam2,
        matchId: matchId,
        id: this.goalsTeam2.length + 1,
        playerName: playerName
      };

      this.createGoal(newGoal, 2);

      this.newGoalTeam2 = {
        player: 0,
        goals: 0,
        teamId: this.newGoalTeam2.teamId,
        playerName: ''
      };
    }
  }


  async createGoal(goal: Goal, teamNumber: number): Promise<void> {
    try {
      const goalData = {
        goal_number: Number(goal.goals),
        game: Number(goal.matchId) || 0,
        player: Number(goal.player) || 0
      }

      if (goalData.goal_number < 0 || !goalData.game || !goalData.player) {
        this.showNotification('error', 'Datos de gol inválidos', 'error');
        return;
      }

      const res = await this.tournamentService.createGoal(goalData);

      const newGoal = {
        ...goal,
        idPost: res.id
      }

      if (teamNumber === 1) {
        this.goalsTeam1.push(newGoal);
      } else {
        this.goalsTeam2.push(newGoal);
      }
      
      this.showNotification('Éxito', 'Gol registrado correctamente', 'success');
      
    } catch (error) {
      console.error('Error al crear gol:', error);
    }
  }

  addSanction(matchId: number, teamNumber: number): void {
    if (teamNumber === 1) {
      if (this.newSanctionTeam1.type === 'P' && !this.newSanctionTeam1.playerId) {
        this.showNotification('Advertencia', 'Debe seleccionar un jugador para la sanción', 'warning');
        return;
      }
      
      let playerName = '';
      if (this.newSanctionTeam1.type === 'P') {
        const player = this.playersTeam1.find(p => p.id === this.newSanctionTeam1.playerId);
        playerName = player ? player.full_name : 'Jugador desconocido';
      }
      
      const newSanction = {
        ...this.newSanctionTeam1,
        id: this.sanctionsTeam1.length + 1,
        matchId: matchId,
        playerName: playerName
      };

      this.createSanction(newSanction, 1);
      
      this.newSanctionTeam1 = {
        id: 0,
        type: 'P',
        reason: '',
        playerId: 0,
        teamId: this.newSanctionTeam1.teamId,
        playerName: '',
        missedDates: 0,
        yellowCards: '0',
        redCard: '0',
        matchId: matchId
      };
    } else {
      if (this.newSanctionTeam2.type === 'P' && !this.newSanctionTeam2.playerId) {
        this.showNotification('Advertencia', 'Debe seleccionar un jugador para la sanción', 'warning');
        return;
      }
      
      let playerName = '';
      if (this.newSanctionTeam2.type === 'P') {
        const player = this.playersTeam2.find(p => p.id === this.newSanctionTeam2.playerId);
        playerName = player ? player.full_name : 'Jugador desconocido';
      }
      


      const newSanction = {
        ...this.newSanctionTeam2,
        id: this.sanctionsTeam2.length + 1,
        matchId: matchId,
        playerName: playerName
      };

      this.createSanction(newSanction, 2);
      
      this.newSanctionTeam2 = {
        id: 0,
        type: 'P',
        reason: '',
        playerId: 0,
        teamId: this.newSanctionTeam2.teamId,
        playerName: '',
        missedDates: 0,
        yellowCards: '0',
        matchId: matchId,
        redCard: '0'
      };
    }
  }

  async createSanction(sanction: Sanction, teamNumber: number): Promise<void> {
    try {
      const sanctionData = {
        sanction_for: sanction.type,
        reason: sanction.reason || '',
        missed_dates: Number(sanction.missedDates) || 0,
        yellow_cards: Number(sanction.yellowCards) || 0,
        red_card: Number(sanction.redCard) || 0,
        game: Number(sanction.matchId) || 0,
        player: sanction.type === 'P' ? Number(sanction.playerId) || 0 : null
      }

      if (!sanctionData.game || (sanctionData.sanction_for === 'P' && !sanctionData.player)) {
        this.showNotification('Error', 'Datos de sanción inválidos', 'error');
        return;
      }

      const res = await this.tournamentService.createSanction(sanctionData);  

      const newSanction = {
        ...sanction,
        playerName: res.player.full_name,
        idPost: res.id,
        res: res
      }
      
      this.showNotification('Éxito', 'Sanción registrada correctamente', 'success');

      if (teamNumber === 1) {
        this.sanctionsTeam1.push(newSanction);
      } else {
        this.sanctionsTeam2.push(newSanction);
      }
      
    } catch (error) {
      console.error('Error al crear sanción:', error);
    }
  }

  removeGoal(goal: Goal, teamNumber: number): void {

    if (teamNumber === 1) {
      if (goal.idPost) {
        this.tournamentService.deleteGoal(goal.idPost);
      }

      this.goalsTeam1 = this.goalsTeam1.filter(g => g !== goal);
    } else {
      if (goal.idPost) {
        this.tournamentService.deleteGoal(goal.idPost);
      }

      this.goalsTeam2 = this.goalsTeam2.filter(g => g !== goal);
    }
    
    this.showNotification('Éxito', 'Gol eliminado correctamente', 'success');
  }

  removeSanction(sanction: Sanction, teamNumber: number): void {
    if (teamNumber === 1) {
      if (sanction.idPost) {
        this.tournamentService.deleteSanction(sanction.idPost);
      }

      this.sanctionsTeam1 = this.sanctionsTeam1.filter(s => s.id !== sanction.id);
    } else {
      if (sanction.idPost) {
        this.tournamentService.deleteSanction(sanction.idPost);
      }
      this.sanctionsTeam2 = this.sanctionsTeam2.filter(s => s.id !== sanction.id);
    }
    
    this.showNotification('Éxito', 'Sanción eliminada correctamente', 'success');
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  showNotification(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    Swal.fire({
      title,
      text: message,
      icon: type,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
  
  getTotalGoals(goals: Goal[]): number {
    if (!goals || goals.length === 0) return 0;
    return goals.reduce((total, goal) => total + goal.goals, 0);
  }

  saveResults(): void {
    if (!this.selectedMatchId) {
      this.showNotification('Advertencia', 'Debe seleccionar un partido para guardar resultados', 'warning');
      return;
    }
    
    this.tournamentService.saveChangesGame(this.selectedMatchId);

    this.showNotification('Éxito', 'Resultados guardados correctamente', 'success');
  }
}
