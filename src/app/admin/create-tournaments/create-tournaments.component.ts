import { Component } from '@angular/core';

@Component({
  selector: 'app-create-tournaments',
  templateUrl: './create-tournaments.component.html',
  styleUrls: ['./create-tournaments.component.scss']
})

export class CreateTournamentsComponent {
  currentStep = 0;
  tournamentData: any = {};
  categories: string[] = ['Senior', 'Maxi Senior', 'Juvenil', 'Infantil'];
  steps = ['Información del Torneo', 'Fechas a Jugar', 'Programar Partidos', 'Resumen'];

  handleNext(data: any): void {
    if (this.currentStep === 1) {
      this.tournamentData = {
        ...this.tournamentData,
        ...data,
        dates: [...(this.tournamentData.dates || []), ...data.dates]
      };
    } else {
      this.tournamentData = { ...this.tournamentData, ...data };
    }
    this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
  }

  handleBack(): void {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }

  submitCurrentForm(){
    
  }
}
