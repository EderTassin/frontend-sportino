import { Component, OnInit, ViewChild } from '@angular/core';
import { TournamentService } from './service/tournament.service';
import { TournamentFormComponent } from './tournament-form/tournament-form.component';
import { DatesFormComponent } from './dates-form/dates-form.component';
import { MatchesFormComponent } from './matches-form/matches-form.component';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { EstadisticaPartidosService } from '../home/tabla-fixture/service/estadistica-partidos.service';

@Component({
  selector: 'app-create-tournaments',
  templateUrl: './create-tournaments.component.html',
  styleUrls: ['./create-tournaments.component.scss']
})
export class CreateTournamentsComponent implements OnInit {
  currentStep: number = 0;
  tournamentData: any[] = [{}, [], []];
  steps: string[] = ['Información del Torneo', 'Fechas a Jugar', 'Programar Partidos', 'Resumen'];
  isCurrentFormValid = false;
  tournamentId: number | null = null;
  originalTournamentData: any;
  isEditMode = false;

  @ViewChild(TournamentFormComponent) tournamentFormComponent!: TournamentFormComponent;
  @ViewChild(DatesFormComponent) datesFormComponent!: DatesFormComponent;
  @ViewChild(MatchesFormComponent) matchesFormComponent!: MatchesFormComponent;

  constructor(
    private tournamentService: TournamentService,
    private estadisticaService: EstadisticaPartidosService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.tournamentId = +id;
        this.isEditMode = true;
        this.loadExistingTournament(this.tournamentId);
      } else {
        this.isCurrentFormValid = false;
      }
    });
  }

  async loadExistingTournament(id: number) {
    try {
      const tournament = await this.tournamentService.getTournamentById(id);
      const dates = await this.tournamentService.getDatesByTournament(id);
      const matches: any[] = [];

      this.tournamentData = [
        tournament || {},
        dates || [],
        matches
      ];
      
      this.originalTournamentData = JSON.parse(JSON.stringify(this.tournamentData));

      this.currentStep = 3;
      this.isCurrentFormValid = true;

    } catch (error: any) {
      const errorMessage = error?.error?.detail || 'Error al cargar el torneo existente';
      this.toastr.error(errorMessage);
      console.error("Load existing tournament error:", error);
    }
  }

  handleNext() {
    const currentFormData = this.getCurrentFormData();
    if (this.isCurrentFormValid || this.isEditMode) {
       if (currentFormData !== null && this.currentStep < 3) {
          this.tournamentData[this.currentStep] = currentFormData;
       }

        if (this.currentStep < this.steps.length - 1) {
          this.currentStep++;
          this.isCurrentFormValid = this.isEditMode; 
       }
    } else {
         this.toastr.error('Por favor complete el formulario correctamente antes de continuar.');
    }
  }

  hasTournamentDataChanged(existingData: any, newData: any): boolean {
     if (!existingData) return true;
     return JSON.stringify(existingData) !== JSON.stringify(newData);
  }

  changeStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.isCurrentFormValid = this.isEditMode;
    }
  }

  handleBack(): void {
    if (this.currentStep > 0) {
        this.currentStep--;
        this.isCurrentFormValid = true;
    }
  }

  getCurrentFormData() {
    try {
      switch (this.currentStep) {
        case 0:
          if (!this.tournamentFormComponent) return null;
          this.isCurrentFormValid = this.tournamentFormComponent.form.valid;
          return this.tournamentFormComponent.getFormData();
        case 1:
           if (!this.datesFormComponent) return null;
           this.isCurrentFormValid = this.datesFormComponent.form.valid || (this.datesFormComponent.dates && this.datesFormComponent.dates.length > 0);
           return this.datesFormComponent.getFormData();
        case 2:
           if (!this.matchesFormComponent) return null;
           this.isCurrentFormValid = true;
           return this.matchesFormComponent.getFormData();
        default:
          this.isCurrentFormValid = true;
          return null;
      }
    } catch (error) {
        console.error("Error getting form data from child component", error);
        this.toastr.error("Error al obtener datos del paso actual.");
        this.isCurrentFormValid = false;
        return null;
    }
  }

  navigateToStep(stepIndex: number): void {
    if (this.isEditMode || stepIndex <= this.currentStep) {
      this.currentStep = stepIndex;
      this.isCurrentFormValid = true;
    } else if (!this.isCurrentFormValid) {
        this.toastr.info("Complete el paso actual correctamente para avanzar.");
    } else {
        this.currentStep = stepIndex;
        this.isCurrentFormValid = this.isEditMode;
    }
  }

  handleSkipToSummary(): void {
    if (this.isEditMode) {
      this.currentStep = 3;
      this.isCurrentFormValid = true;
    }
  }

  async saveTournament() {
    const currentFormData = this.getCurrentFormData();
    if (currentFormData !== null && this.currentStep < 3) {
       this.tournamentData[this.currentStep] = currentFormData;
    }

    const tournamentInfo = this.tournamentData[0];
    const dates = this.tournamentData[1];
    const matches = this.tournamentData[2];

    if (!tournamentInfo || !tournamentInfo.name || !tournamentInfo.date_from || !tournamentInfo.date_to) {
        this.toastr.error("La información básica del torneo (Nombre, Fechas) es requerida.");
        this.navigateToStep(0);
        return;
    }

    try {
      if (this.isEditMode && this.tournamentId) {
        await this.tournamentService.updateTournament(this.tournamentId, tournamentInfo);

        if (dates && dates.length > 0) {
           const newDates = dates.filter((d: any) => !d.id);
            if(newDates.length > 0) {
               const datesToAdd = newDates.map((date: any) => ({ date: date.date, tournament: [this.tournamentId], active: true }));
               await this.tournamentService.addDates(datesToAdd);
            }
        }
         if (matches && matches.length > 0) {
            const newMatches = matches.filter((m: any) => !m.id);
            if(newMatches.length > 0) {
               const matchesToAdd = newMatches.map((match: any) => ({ date: match.date, team_1: match.teamA, team_2: match.teamB, tournament: this.tournamentId, field: match.court, hour: match.hour, active: true }));
                await this.tournamentService.addMatches(matchesToAdd);
            }
        }

        this.toastr.success('Torneo actualizado con éxito');

      } else {
         const createdTournament = await this.tournamentService.createTournament(tournamentInfo);
         const newTournamentId = createdTournament.id;

         if (dates && dates.length > 0) {
             const datesToAdd = dates.map((date: any) => ({ date: date.date, tournament: [newTournamentId], active: true }));
             await this.tournamentService.addDates(datesToAdd);
         }
         if (matches && matches.length > 0) {
             const matchesToAdd = matches.map((match: any) => ({ date: match.date, team_1: match.teamA, team_2: match.teamB, tournament: newTournamentId, field: match.court, hour: match.hour, active: true }));
             await this.tournamentService.addMatches(matchesToAdd);
         }
         this.toastr.success('Torneo creado con éxito');
      }
      this.router.navigate(['/admin/tournaments']);

    } catch (error: any) {
       const errorMessage = error?.error?.detail || 'Error al guardar el torneo.';
       this.toastr.error(errorMessage);
       console.error("Save tournament error:", error);
    }
  }

  onFormValidityChange(isValid: boolean) {
     this.isCurrentFormValid = isValid;
  }

  onDatesChange(isValid: boolean) {
      this.isCurrentFormValid = isValid || (this.datesFormComponent?.dates?.length > 0);
  }

   onMatchesValidityChange(isValid: boolean) {
     this.isCurrentFormValid = true;
   }

  handleVolver() {
    this.router.navigate(['/admin/torneos']);
  }
}

