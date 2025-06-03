import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent {
  isAdminPanelVisible = false;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit() {
  }

  toggleAdminPanel() {
    this.isAdminPanelVisible = !this.isAdminPanelVisible;
  }

  navigateTo(section: string): void {
    this.router.navigate([`admin/${section}`]);
  }

  redirectToCreateTournament(): void {
    this.router.navigate(['/create-tournament']);
  }

  async downloadBackup() {
    const backup = await this.adminService.getBackupData();
    const date = new Date().toISOString().split('T')[0];
    this.downloadJsonFile(backup, `backup-${date}.json`);
  }
  
  downloadJsonFile(data: any, filename: string): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
