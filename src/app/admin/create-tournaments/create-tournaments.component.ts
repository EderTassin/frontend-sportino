import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-create-tournaments',
  templateUrl: './create-tournaments.component.html',
  styleUrls: ['./create-tournaments.component.scss']
})
export class CreateTournamentsComponent {

  tournaments: any;
  tournamentsOriginal: any;
  filter: any;

  constructor(private router: Router, private tournamentsService: AdminService) { }


  ngOnInit(): void {
    this.getTournaments();
  }


  getTournaments() {
    this.tournamentsService.getTournaments().subscribe((tournaments) => {
      this.tournaments = tournaments;
      this.tournamentsOriginal = tournaments;
    });

    console.log(this.tournaments);
    
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  openModal() {
    //document.getElementById('myModal').style.display = 'block';
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;

    console.log(filterValue);
    

    if (!filterValue || filterValue === '') {
      this.tournaments = this.tournamentsOriginal;
    }
    this.tournaments = this.tournamentsOriginal.filter((tournament: any) => {
        return tournament.name.toLowerCase().includes(filterValue.toLowerCase());
      }
    );
  }

}
