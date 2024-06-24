import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isLoggin: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authStatus.subscribe((isAuthenticated:any) => {
      this.isLoggin = !isAuthenticated;
    });
  }
}
