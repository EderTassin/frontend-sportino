import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TournamentService } from '../service/tournament.service';

@Component({
  selector: 'app-dates-form',
  templateUrl: './dates-form.component.html',
  styleUrls: ['./dates-form.component.scss']
})
export class DatesFormComponent implements OnInit {

  @Input() initialData: any;
  @Input() isEditMode: boolean = false;
  @Output() datesChange = new EventEmitter<boolean>();

  form: FormGroup;
  dates: any[] = [];

  constructor(private fb: FormBuilder, private tournamentService: TournamentService) {
    this.form = this.fb.group({
      newDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.initialData && this.initialData[1]) {
      this.dates = [...this.initialData[1]];
    }
    this.emitValidity();
  }

  get newDateControl() {
    return this.form.get('newDate') as FormControl;
  }

  getFormData() {
    return this.dates;
  }

  addDate() {
    if (this.form.valid) {
      const newDateValue = this.form.value.newDate;
      if (!this.dates.some(d => d.date === newDateValue)) {
        this.dates.push({
          date: newDateValue
        });
        this.form.reset();
        this.emitValidity();
      } else {
        console.warn("Date already added:", newDateValue);
      }
    } else {
      this.newDateControl.markAsTouched();
    }
  }

  async removeDate(index: number) {
    const dateToRemove = this.dates[index];
    if (dateToRemove?.id) {
      try {
        await this.tournamentService.deleteDate(dateToRemove.id);
        this.dates.splice(index, 1);
        this.emitValidity();
      } catch (error) {
        console.error("Error deleting date:", error);
      }
    } else {
      this.dates.splice(index, 1);
      this.emitValidity();
    }
  }

  isFormValid(): boolean {
    return this.dates.length > 0;
  }

  emitValidity() {
    this.datesChange.emit(this.isFormValid());
  }
}