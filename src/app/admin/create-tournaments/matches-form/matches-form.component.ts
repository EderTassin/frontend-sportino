import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-matches-form',
  templateUrl: './matches-form.component.html',
  styleUrls: ['./matches-form.component.scss']
})
export class MatchesFormComponent {
  @Input() initialData: any;
  @Output() formSubmit = new EventEmitter<any>();
}
