import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  installPromptEvent: any;
  showInstallButton: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    this.showInstallButton = true;
    this.installPromptEvent = event as any;
    event.preventDefault();
  }

  installPWA() {
    if (this.installPromptEvent) {
      this.installPromptEvent.prompt();
    }
  }
  
  redirect(){
    this.router.navigateByUrl('/')
  }

}
