import { Component, OnInit, ViewChild } from '@angular/core';
import { TournamentService } from './service/tournament.service';
import { TournamentFormComponent } from './tournament-form/tournament-form.component';
import { DatesFormComponent } from './dates-form/dates-form.component';
import { MatchesFormComponent } from './matches-form/matches-form.component';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-tournaments',
  templateUrl: './create-tournaments.component.html',
  styleUrls: ['./create-tournaments.component.scss']
})
export class CreateTournamentsComponent implements OnInit {
  currentStep: number = 0;
  tournamentData: any[] = [];
  steps: string[] = ['Información del Torneo', 'Fechas a Jugar', 'Programar Partidos', 'Resumen'];
  isCurrentFormValid = false;

  @ViewChild(TournamentFormComponent) tournamentFormComponent!: TournamentFormComponent;
  @ViewChild(DatesFormComponent) datesFormComponent!: DatesFormComponent;
  @ViewChild(MatchesFormComponent) matchesFormComponent!: MatchesFormComponent;

  constructor(
    private tournamentService: TournamentService, 
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("Componente inicializado");

    // Verificar si hay un ID en la URL
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadExistingTournament(params['id']);
      }
    });
  }

  async loadExistingTournament(id: number) {
    try {
      // Cargar datos del torneo
      const tournament = await this.tournamentService.getTournamentById(id);
      this.tournamentData[0] = tournament;
      
      // Cargar fechas del torneo
      const dates = await this.tournamentService.getDatesByTournament(id);
      this.tournamentData[1] = dates;
      
      // Si hay datos, avanzar al último paso completado
      if (this.tournamentData[0]) {
        this.currentStep = dates.length > 0 ? 2 : 1;
      }
    } catch (error: any) {
      this.toastr.error('Error al cargar el torneo');
      console.error(error);
    }
  }

  handleNext() {
    const currentFormData = this.getCurrentFormData();

    if (currentFormData) {
      this.tournamentData[this.currentStep] = currentFormData;

      if (this.currentStep === 0 && this.tournamentData[0].id == undefined) {
        this.createTournament();
      }

      if (this.currentStep === 1) {
        this.createDates();
      }
    }
  }

  changeStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  handleBack(): void {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  getCurrentFormData() {
    switch (this.currentStep) {
      case 0:
        return this.tournamentFormComponent.getFormData();
      case 1:
        return this.datesFormComponent.getFormData();
      case 2:
        return this.matchesFormComponent.getFormData();
      default:
        return {};
    }
  }

  async createTournament() {
    try {
      const response = await this.tournamentService.createTournament(this.tournamentData[0]);
      this.tournamentData[0].id = response.id;
      this.router.navigate(['/create-tournament', response.id]);
      this.changeStep();
    } catch (error: any) { 
      console.error(error.error.detail);
      this.toastr.error(error.error.detail);
    }
  }

  async createDates() {
    if (this.tournamentData[1][0]?.id != undefined) this.changeStep();

    try {
      const listDate = this.tournamentData[1].map((date: any) => {
        return {
          date: date.date,
          tournament: [this.tournamentData[0].id],
          active: true
        }
      })

      const response = await this.tournamentService.addDates(listDate);
            
      this.tournamentData[1] = response;
      
      this.changeStep();
    } catch (error: any) {
      console.error(error.error.detail);
      this.toastr.error(error.error.detail);
    }
  }

  onFormValidityChange(isValid: boolean) {
    this.isCurrentFormValid = isValid;
  }

  onDatesChange(isValid: boolean) {
    this.isCurrentFormValid = isValid;
  }
}
  