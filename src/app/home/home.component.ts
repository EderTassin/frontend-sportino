import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  installPromptEvent: any;
  showInstallButton: boolean = true;
  slider!: KeenSliderInstance;
  @ViewChild('titleCarousel') titleCarousel!: ElementRef;
  @ViewChild("sliderRef") sliderRef!: ElementRef<HTMLElement>

  constructor() { }

  ngOnInit() {}


  currentSlide: number = 1
  dotHelper: Array<Number> = []

  ngAfterViewInit() {
    setTimeout(() => {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: this.currentSlide,
        slideChanged: (s) => {
          this.currentSlide = s.track.details.rel
        },
      })
      this.dotHelper = [
        ...Array(this.slider.track.details.slides.length).keys(),
      ]
    })
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
  }

  scrollToTitleCarousel() {
    this.titleCarousel.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
