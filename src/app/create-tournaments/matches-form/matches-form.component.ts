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
    console.log('MatchesFormComponent: ', this.initialData);

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
    return this.form.value;
  }

  addMatch() {
    if(this.form.value.teamA && this.form.value.teamB && this.form.value.date 
      && this.form.value.hour && this.form.value.court) {
      this.listMatches.push(this.form.value);
      this.form.reset();
    }
  }

  deleteMatch(match: any) {
    this.listMatches = this.listMatches.filter(m => m !== match);
  }
}
