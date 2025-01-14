import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.scss']
})
export class TournamentFormComponent {
  @Input() initialData: any;
  @Input() categories: string[] = [];
  @Output() formSubmit = new EventEmitter<any>();
}
