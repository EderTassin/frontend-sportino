import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tournament-summary',
  templateUrl: './tournament-summary.component.html',
  styleUrls: ['./tournament-summary.component.scss']
})
export class TournamentSummaryComponent implements OnInit {
  @Input() tournament: any;
  @Input() isEditMode: boolean = false;
  @Output() sectionChange = new EventEmitter<number>();

  tournamentData: any = {};
  dates: any[] = [];
  matches: any[] = [];
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
    if (Array.isArray(this.tournament) && this.tournament.length > 0) {
      this.tournamentData = this.tournament[0] || {};
      this.dates = this.tournament[1] || [];
      this.matches = this.tournament[2] || [];
    } else {
      this.tournamentData = this.tournament || {};
      console.warn("TournamentSummaryComponent received unexpected data structure:", this.tournament);
    }
  }

  get formattedStartDate() {
    const date = this.tournamentData?.date_from;
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  }

  get formattedEndDate() {
    const date = this.tournamentData?.date_to;
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  }

  getCategoryNames(): string {
    if (!this.tournamentData?.category || this.tournamentData.category.length === 0) {
        return "N/A";
    }
    return this.tournamentData.category
        .map((categoryId: number) => {
            const category = this.categories.find(cat => cat.id === categoryId);
            return category ? category.name : `ID: ${categoryId}`;
        })
        .join(', ');
  }

  editSection(sectionIndex: number) {
    console.log("Emitting section change:", sectionIndex);
    this.sectionChange.emit(sectionIndex);
  }
}
