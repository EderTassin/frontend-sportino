import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent {
  isAdminPanelVisible = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleAdminPanel() {
    this.isAdminPanelVisible = !this.isAdminPanelVisible;
    console.log('Panel visibility:', this.isAdminPanelVisible);
  }

  navigateTo(section: string): void {
    this.router.navigate([`admin/${section}`]);
  }
}
