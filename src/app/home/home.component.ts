import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  installPromptEvent: any;
  showInstallButton: boolean = true;

  constructor() { }

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
  
}
