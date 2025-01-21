import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-matches-form',
  templateUrl: './matches-form.component.html',
  styleUrls: ['./matches-form.component.scss']
})
export class  MatchesFormComponent {
  @Input() initialData: any;
  @Output() formSubmit = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      dates: ['', Validators.required]
    });
  }

  getFormData() {
    return this.form.value;
  }
}
