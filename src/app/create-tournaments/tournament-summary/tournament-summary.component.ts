import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tournament-summary',
  templateUrl: './tournament-summary.component.html',
  styleUrls: ['./tournament-summary.component.scss']
})
export class TournamentSummaryComponent {
  @Input() tournament: any;
  tournamentData: any;
  dates: any;
  matches: any;
  id: any;

  categories = [
    { id: 0, name: "SENIORS" },
    { id: 1, name: "MAXI SENIORS 40" },
    { id: 2, name: "SUPER MAXI 45" },
    { id: 3, name: "MASTER" },
    { id: 10, name: "SUPER MASTER" },
    { id: 33, name: "LIBRE" }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.tournamentData = this.tournament[0];
    this.dates = this.tournament[1];
    this.matches = this.tournament[2];
  }

  get formattedStartDate() {
    return new Date(this.tournament?.date_from).toLocaleDateString();
  }

  get formattedEndDate() {
    return new Date(this.tournament?.date_to).toLocaleDateString();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  }

  confirmTournament() {
    this.router.navigate(['/admin']);
  }
}
