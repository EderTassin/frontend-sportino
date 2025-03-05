import { Component } from '@angular/core';
import { TournamentService } from 'src/app/create-tournaments/service/tournament.service';
import { AdminService } from '../service/admin.service';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-date-management',
  templateUrl: './date-management.component.html',
  styleUrls: ['./date-management.component.scss']
})
export class DateManagementComponent {

  dates: any;
  tournaments: any;
  showModal = false;
  datesControl: FormControl;
  selectedTournament: any;
  datesSelected: any[] = [];
  sortColumn: string = 'date';
  sortDirection: string = 'asc';
  sortDirectionDate: string = 'asc';
  sortDirectionId: string = 'asc';
  constructor(private tournamentsService: TournamentService, 
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.datesControl = new FormControl('', Validators.required);
  }

  async ngOnInit() {
    await this.getTournaments();
    if (this.tournaments.length) {
      await this.getDates();
    }
  }

  async getDates() {
    const response = await this.tournamentsService.getDates();
    this.dates = response.map((date: any) => {
      const tournamentNames = date.tournament.map((id: number) => {
        const found = this.tournaments.find((t: any) => t.id === id);
        return found ? found.name : 'Torneo no encontrado';
      });
      
      return {
        id: date.id,
        date: date.date,
        active: date.active,
        tournament: tournamentNames.join(' - '),
      }
    });

    this.dates.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  }

  async getTournaments() {
    const tournaments = await this.adminService.getTournaments();
    this.tournaments = tournaments.map((tournament: any) => {
      return {
        id: tournament.id,
        name: tournament.name,
      }
    });
  }

  openNewDateModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.datesSelected = [];
    this.datesControl.reset();
  }

  addDate() {
    this.datesSelected.push({
      index: this.datesSelected.length + 1,
      date: this.datesControl.value,
      tournament: this.selectedTournament
    });

    this.datesControl.reset();
  }

  removeDate(index: number) {
    this.datesSelected.splice(index, 1);
  }

  async createDates() {

    if (!this.datesSelected || this.datesSelected.length === 0) {
      this.toastr.error('Debe seleccionar al menos una fecha');
      return;
    }

    const listDate = this.datesSelected.map((date: any) => ({
      date: date.date,
      tournament: [date.tournament],
      active: true
    }));

    try {
      await this.tournamentsService.addDates(listDate);
      this.datesSelected = [];
      this.datesControl.reset();
      this.toastr.success('Fechas creadas correctamente');
      this.showModal = false;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDate(index: number, id: number) {
    try {
      await this.tournamentsService.deleteDate(id.toString());
      this.dates.splice(index, 1);
    } catch (error) {
      console.log(error);
    }
  }

  sortDates(column: string) {
    if (this.sortColumn === column) {
      this.sortDirectionDate = this.sortDirectionDate === 'asc' ? 'desc' : 'asc';
      this.dates.sort((a: any, b: any) => {
        if (this.sortDirectionDate === 'asc') {
          return a.id - b.id;
        } else {
          return b.id - a.id;
        }
      });
    } else {
      this.sortColumn = column;
    }
  }

  sortDatesId(column: string) {
    if (this.sortColumn === column) {
      this.sortDirectionId = this.sortDirectionId === 'asc' ? 'desc' : 'asc';
      this.dates.sort((a: any, b: any) => {
        if (this.sortDirectionId === 'asc') {
          return a[column] - b[column];
        } else {
          return b[column] - a[column];
        }
      });
    } else {
      this.sortColumn = column;
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
