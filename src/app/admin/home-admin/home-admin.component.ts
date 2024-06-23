import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent {

  constructor(private router: Router) { }

  navigateTo(section: string): void {
    this.router.navigate([`/${section}`]);
  }
  
}
