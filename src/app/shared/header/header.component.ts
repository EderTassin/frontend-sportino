import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollService } from '../service/scroll.service';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  installPromptEvent: any;
  showInstallButton: boolean = true;
  isLoggin: boolean = false
  user: any;

  constructor(private scrollService: ScrollService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.authService.authStatus.subscribe((isAuthenticated: any) => {
      this.isLoggin = !isAuthenticated;
    });
    this.getUser();
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    this.showInstallButton = true;
    this.installPromptEvent = event as any;
    event.preventDefault();
  }

  async getUser() {
    this.user = await this.authService.getUser();
    console.log(this.user);
  }

  installPWA() {
    if (this.installPromptEvent) {
      this.installPromptEvent.prompt();
    }
  }
  
  redirect(){
    this.router.navigateByUrl('/')
  }

  scrollToTop() {
    this.router.navigate(['/']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  navigateToLocation() {
    this.scrollService.triggerScrollToLocation();
  }

  logout() {
    this.authService.logout();
  }
}
