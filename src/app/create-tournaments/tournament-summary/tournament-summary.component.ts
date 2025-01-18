import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tournament-summary',
  templateUrl: './tournament-summary.component.html',
  styleUrls: ['./tournament-summary.component.scss']
})
export class TournamentSummaryComponent {
  @Input() data: any;
}
