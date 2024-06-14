import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { Subscription } from 'rxjs';
import { ScrollService } from '../shared/service/scroll.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('locationSection') locationSection!: ElementRef;

  installPromptEvent: any;
  showInstallButton: boolean = true;

  private scrollSubscription!: Subscription;
  currentImage: string;
  private intervalId: any;

  private images: string[] = [
    '../../assets/carousel/3.jpeg',
    '../../assets/carousel/4.jpeg',
    '../../assets/carousel/5.jpeg',
  ];



  constructor(private scrollService: ScrollService) {
    this.currentImage = this.images[0];
  }

  ngOnInit(): void {

    let currentIndex = 0;
    this.intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % this.images.length;
      this.currentImage = this.images[currentIndex];
    }, 2000);


    this.scrollSubscription = this.scrollService.scrollToLocation$.subscribe(() => {
      this.locationSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
