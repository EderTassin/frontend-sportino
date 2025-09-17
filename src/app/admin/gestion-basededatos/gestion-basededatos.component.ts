import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-gestion-basededatos',
  templateUrl: './gestion-basededatos.component.html',
  styleUrls: ['./gestion-basededatos.component.scss']
})
export class GestionBasededatosComponent {

  backupFile: File | null = null;


  goBack() {
    this.router.navigate(['/admin']);
  }

  constructor(private router: Router, private adminService: AdminService, private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  async downloadBackup() {
    const backup = await this.adminService.getBackupData(false);
    const fechaHoy = new Date().toISOString().split('T')[0];
    const horaActual = new Date().toLocaleTimeString().replace(/:/g, '-');
    
    if (backup) {
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${fechaHoy}_${horaActual}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
  
  async createBackup() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: '¿Está seguro que desea ELIMINAR y DESCARGAR el backup actual?' }
    });

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        const backup = await this.adminService.getBackupData(true);
        const fechaHoy = new Date().toISOString().split('T')[0];
        const horaActual = new Date().toLocaleTimeString().replace(/:/g, '-');
        
        if (backup) {
          const jsonStr = JSON.stringify(backup, null, 2);
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          a.download = `backup-${fechaHoy}_${horaActual}.json`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }
    });
  }
  
  async subirBackup(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.backupFile = input.files[0];
      await this.adminService.uploadBackup(this.backupFile);
      this.backupFile = null;
    }
  }
}
