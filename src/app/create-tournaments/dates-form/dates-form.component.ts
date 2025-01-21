import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dates-form',
  templateUrl: './dates-form.component.html',
  styleUrls: ['./dates-form.component.scss']
})
export class DatesFormComponent {

  @Input() initialData: any;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() datesChange = new EventEmitter<any[]>();

  form: FormGroup;
  dates: any[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      dates: ['', Validators.required]
    });
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
    this.datesChange.emit(this.dates);
  }

  removeDate(index: number) {
    this.dates.splice(index, 1);
    this.datesChange.emit(this.dates);
  }
}
