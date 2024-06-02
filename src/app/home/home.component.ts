import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('titleCarousel') titleCarousel!: ElementRef;

  installPromptEvent: any;
  showInstallButton: boolean = true;

  private images: string[] = [
    '../../assets/carousel/3.jpeg',
    '../../assets/carousel/4.jpeg',
    '../../assets/carousel/5.jpeg',
    'https://scontent.fcor7-1.fna.fbcdn.net/v/t39.30808-6/444488195_1255608605862793_367343641783305826_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=XpjthkBGbXMQ7kNvgF3-mME&_nc_ht=scontent.fcor7-1.fna&oh=00_AYBR99aqiouB-PbWJ8eakpRSf-EQWY5UrQ_5UoqdHQccTw&oe=666193ED',
    'https://scontent.fcor7-1.fna.fbcdn.net/v/t39.30808-6/444991214_1255608622529458_3202741278916712283_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=GzaxfjKzB20Q7kNvgFFNT3u&_nc_ht=scontent.fcor7-1.fna&oh=00_AYBLKfezyrp2w7vmNQ0Hdkuck3z-G49Exz59qadioOWt5g&oe=6661AFCB'
  ];



  currentImage: string;
  private intervalId: any;

  constructor() {
    this.currentImage = this.images[0];
  }

  ngOnInit(): void {
    let currentIndex = 0;
    this.intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % this.images.length;
      this.currentImage = this.images[currentIndex];
    }, 2000);
  }

  currentSlide: number = 1
  dotHelper: Array<Number> = []

  scrollToTitleCarousel() {
    this.titleCarousel.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
