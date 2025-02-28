import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TournamentService } from '../service/tournament.service';
import { EstadisticaPartidosService } from 'src/app/home/tabla-fixture/service/estadistica-partidos.service';

@Component({
  selector: 'app-dates-form',
  templateUrl: './dates-form.component.html',
  styleUrls: ['./dates-form.component.scss']
})
export class DatesFormComponent {

  @Input() initialData: any;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() datesChange = new EventEmitter<boolean>();

  form: FormGroup;
  dates: any[] = [];

  constructor(private fb: FormBuilder, private tournamentService: TournamentService, private estadisticaPartidosService: EstadisticaPartidosService) {
    this.form = this.fb.group({
      dates: ['', Validators.required]
    });
    this.form.statusChanges.subscribe(status => {
      this.datesChange.emit(status === 'VALID');
    });
  }

  ngOnInit() {
    if (this.initialData[1]) {
      this.dates = this.initialData[1];
      this.form.patchValue({ dates: this.dates });
    }
    
  }

  get datesControl() {
    return this.form.get('dates') as FormControl;
  }

  getFormData() {
    return this.dates;
  }

  addDate() {
    this.dates.push({
      index: this.dates.length + 1,
      date: this.form.value.dates
    });

    this.form.reset();
    this.datesChange.emit(true);
  }

  async removeDate(index: number) {
    this.dates.splice(index, 1);

    if (this.dates[index]?.id) {
      await this.tournamentService.deleteDate(this.dates[index].id);
    }
  }
}