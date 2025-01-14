import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dates-form',
  templateUrl: './dates-form.component.html',
  styleUrls: ['./dates-form.component.scss']
})
export class DatesFormComponent {

  @Input() initialData: any;
  @Output() formSubmit = new EventEmitter<any>();

}
