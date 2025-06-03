import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadisticaPartidosService } from 'src/app/home/tabla-fixture/service/estadistica-partidos.service';
import { TournamentService } from '../service/tournament.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-matches-form',
  templateUrl: './matches-form.component.html',
  styleUrls: ['./matches-form.component.scss']
})
export class MatchesFormComponent implements OnInit {
  @Input() initialData: any;
  @Input() isEditMode: boolean = false;
  @Output() formValid = new EventEmitter<boolean>();

  form: FormGroup;
  teams: any[] = [];
  listDates: any[] = [];
  listMatches: any[] = [];
  listMatchesDescription: any[] = [];

  constructor(
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private estadisticaPartidosService: EstadisticaPartidosService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      selectedDateId: ['', Validators.required],
      teamA: ['', Validators.required],
      teamB: ['', Validators.required],
      hour: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      court: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getTeams();
    this.loadAvailableDates();

    if (this.initialData && this.initialData[2]) {
      this.listMatches = [...this.initialData[2]];
      this.regenerateMatchDescriptions();
    }
    this.emitValidity();
  }

  async loadAvailableDates() {
    if (this.initialData && this.initialData[1] && this.initialData[1].length > 0) {
      this.listDates = [...this.initialData[1]];
    } else if (this.initialData && this.initialData[0]?.id) {
      try {
        const tournamentId = this.initialData[0].id;
        this.listDates = await this.tournamentService.getDatesByTournament(tournamentId);
      } catch (error) {
        console.error("Error fetching dates for tournament", error);
        this.toastr.error("Error al cargar las fechas del torneo.");
        this.listDates = [];
      }
    } else {
      console.warn("Cannot load dates: No dates in initialData[1] and no tournament ID in initialData[0].");
      this.listDates = [];
    }
  }

  async getTeams() {
    try {
      const teamsData = await this.estadisticaPartidosService.getAllTeams();
      this.teams = teamsData.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch(error) {
      console.error("Error fetching teams", error);
      this.toastr.error("Error al cargar los equipos.");
      this.teams = [];
    }
  }

  getFormData() {
    return this.listMatches;
  }

  regenerateMatchDescriptions() {
    this.listMatchesDescription = this.listMatches.map(match => {
      const teamA = this.teams.find(t => t.id.toString() === match.teamA?.toString());
      const teamB = this.teams.find(t => t.id.toString() === match.teamB?.toString());
      const dateObj = this.listDates.find(d => d.id?.toString() === match.date?.toString());

      return {
        teamA: teamA ? teamA.name : `ID: ${match.teamA}`,
        teamB: teamB ? teamB.name : `ID: ${match.teamB}`,
        date: dateObj ? dateObj.date : `ID: ${match.date}`,
        hour: match.hour,
        court: match.court
      };
    });
  }

  addMatch() {
    if (this.form.valid) {
      if (this.form.value.teamA === this.form.value.teamB) {
        this.toastr.error("El equipo A no puede ser el mismo que el equipo B.");
        return;
      }

      const newMatch = {
        date: this.form.value.selectedDateId,
        teamA: this.form.value.teamA,
        teamB: this.form.value.teamB,
        hour: this.form.value.hour,
        court: this.form.value.court
      };
      
      this.listMatches.push(newMatch);

      const teamA = this.teams.find(t => t.id.toString() === newMatch.teamA.toString());
      const teamB = this.teams.find(t => t.id.toString() === newMatch.teamB.toString());
      const dateObj = this.listDates.find(d => d.id.toString() === newMatch.date.toString());

      const newMatchDescription = {
        teamA: teamA ? teamA.name : 'Equipo desc.',
        teamB: teamB ? teamB.name : 'Equipo desc.',
        date: dateObj ? dateObj.date : 'Fecha desc.',
        hour: newMatch.hour,
        court: newMatch.court
      };

      this.listMatchesDescription.push(newMatchDescription);
      this.form.reset();
      this.emitValidity();

    } else {
      this.toastr.error("Por favor complete todos los campos del partido.");
      this.form.markAllAsTouched();
    }
  }

  deleteMatch(index: number) {
    const matchToRemove = this.listMatches[index];
    this.listMatches.splice(index, 1);
    this.listMatchesDescription.splice(index, 1);
    this.emitValidity();
  }

  formatHour(event: any) {
    let input = event.target;
    let value = input.value.replace(/[^\d:]/g, '');
    let parts = value.split(':');
    
    if (parts[0] && parts[0].length > 2) {
      parts[0] = parts[0].substring(0, 2);
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
    }
    
    value = parts.join(':');

    if (parts[0] && parseInt(parts[0]) > 23) parts[0] = '23';
    if (parts[1] && parseInt(parts[1]) > 59) parts[1] = '59';
    
    value = parts.join(':');
    
    if (value.length === 2 && !value.includes(':')) {
      value += ':';
    } else if (value.length > 5) {
      value = value.substring(0, 5);
    }

    this.form.controls['hour'].setValue(value, { emitEvent: false });
  }
  
  isFormValid(): boolean {
    return true;
  }

  emitValidity() {
    this.formValid.emit(this.isFormValid());
  }
}

