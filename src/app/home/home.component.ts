import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScrollService } from '../shared/service/scroll.service';
import { EstadisticaPartidosService } from './tabla-fixture/service/estadistica-partidos.service';
import { firstValueFrom } from 'rxjs';

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

  // Default images as fallback
  private defaultImages: string[] = [
    '../../assets/carousel/3.webp',
    '../../assets/carousel/4.webp',
    '../../assets/carousel/5.webp',
  ];
  
  // Images array that will be used for the carousel
  private images: string[] = [...this.defaultImages];



  constructor(private scrollService: ScrollService, private estadisticaPartidosService: EstadisticaPartidosService) {
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

    this.getImages();
  }

  async getImages() {
    try {
      const images = await this.estadisticaPartidosService.getFrontPageImages();
      
      if (images && images.length > 0) {
        const activeImages = images.filter((img: any) => img.active);

        if (activeImages.length > 0) {
          this.images = activeImages.map((image: any) => image.image);
          this.currentImage = this.images[0];
          return;
        }
      }
    } catch (error) {
      console.error('Error in getImages():', error);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}


