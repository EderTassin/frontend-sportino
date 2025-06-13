import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { TournamentService } from 'src/app/create-tournaments/service/tournament.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-imprimir-documentos',
  templateUrl: './imprimir-documentos.component.html',
  styleUrls: ['./imprimir-documentos.component.scss']
})
export class ImprimirDocumentosComponent implements OnInit {
  tournaments: any[] = [];
  tournamentSelected: number | null = null;
  dates: any[] = [];
  dateSelected: number | null = null;
  games: any[] = [];
  gameSelected: number | null = null;
  tournamentSelectedDate: number | null = null;

  constructor(private adminService: AdminService, private tournamentService: TournamentService, private router: Router) { }

  ngOnInit(): void {
    this.cargarTorneosActivos();
  }

  async cargarTorneosActivos(): Promise<void> {
    const res = await this.adminService.getTournaments();
    this.tournaments = res;
  }

  async cargarFechas(): Promise<void> {
    if (this.tournamentSelected) {
      const dates = await this.tournamentService.getDatesByTournament(this.tournamentSelected)
      this.dates = dates;
    }
  }

  async cargarPartidos(): Promise<void> {
    if (this.tournamentSelectedDate) {
      const dates = await this.tournamentService.getDatesByTournament(this.tournamentSelectedDate)
      this.dates = dates;
    }
  }

  descargarPDF(){
    if (this.dateSelected) {
      this.adminService.imprimirDocumentosDate(this.dateSelected).subscribe({
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-${this.dates.find(date => date.id === this.dateSelected)?.date}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => console.error('Error descargando PDF', error)
      });
    } else {
      alert('Por favor, seleccione una fecha antes de descargar el PDF.');
    }
  }

  descargarPDFGame(){
    if (this.gameSelected && this.tournamentSelectedDate) {
      this.adminService.imprimirDocumentosGame(this.gameSelected, this.tournamentSelectedDate).subscribe({
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-partido-${this.dates.find(date => date.id === this.gameSelected)?.date}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => console.error('Error descargando PDF de partido', error)
      });
    } else {
      alert('Por favor, seleccione una fecha de partido antes de descargar el PDF.');
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
  