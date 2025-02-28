import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadisticaPartidosService } from 'src/app/home/tabla-fixture/service/estadistica-partidos.service';
import { TournamentService } from '../service/tournament.service';

@Component({
  selector: 'app-matches-form',
  templateUrl: './matches-form.component.html',
  styleUrls: ['./matches-form.component.scss']
})
export class  MatchesFormComponent {
  @Input() initialData: any;
  @Output() formSubmit = new EventEmitter<any>();

  form: FormGroup;
  teams: any[] = [];
  listDates: any[] = [];
  listMatches: any[] = [];
  listMatchesDescription: any[] = [];

  constructor(private fb: FormBuilder, private tournamentService: TournamentService, private estadisticaPartidosService: EstadisticaPartidosService) {
    this.form = this.fb.group({
      dates: ['', Validators.required],
      teamA: ['', Validators.required],
      teamB: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      court: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.form.patchValue({
      dates: this.initialData.dates
    });

    this.listDates = this.initialData[1];
    this.getTeams();
    this.getDatesByTournament();
  }

  async getDatesByTournament() {
    const response = await this.tournamentService.getDatesByTournament(this.initialData[0].id)
    this.listDates = response;
  }


  async getTeams() {
    const teams = await this.estadisticaPartidosService.getAllTeams();
    const sortedTeams = teams.sort((a: any, b: any) => a.name.localeCompare(b.name));
    this.teams = sortedTeams;
  }

  getFormData() {
    return this.listMatches;
  }

  addMatch() {
    // Optional safeguard: check teams is loaded 
    if (!this.teams || !this.teams.length) {
      console.error('Teams not loaded yet or empty');
      return;
    }

    if (this.form.value.teamA && this.form.value.teamB && this.form.value.date 
        && this.form.value.hour && this.form.value.court) {
      
      this.listMatches.push(this.form.value);

      const teamA = this.teams.find(t => t.id.toString() == this.form.value.teamA.toString());
      const teamB = this.teams.find(t => t.id.toString() == this.form.value.teamB.toString());
      const dateObj = this.listDates.find(d => d.id.toString() == this.form.value.date.toString());

      const newMatchDescription = {
        teamA: teamA ? teamA.name : 'Equipo desconocido',
        teamB: teamB ? teamB.name : 'Equipo desconocido',
        date: dateObj ? dateObj : { date: 'Fecha desconocida' },
        hour: this.form.value.hour,
        court: this.form.value.court
      };

      this.listMatchesDescription.push(newMatchDescription);
      this.form.reset();
    }
  }

  deleteMatch(match: any) {
    this.listMatches = this.listMatches.filter(m => m !== match);
  }

  formatHour(event: any) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + ':' + value.substring(2);
    }
    if (value.length > 4) {
      value = value.substring(0, 5);
    }
    let parts = value.split(':');
    if (parts[0] && parseInt(parts[0]) > 23) {
      parts[0] = '23';
      value = parts.join(':');
    }
    if (parts[1] && parseInt(parts[1]) > 59) {
      parts[1] = '59';
      value = parts.join(':');
    }
    this.form.patchValue({ hour: value });
  }
}
