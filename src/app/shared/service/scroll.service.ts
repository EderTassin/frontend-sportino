import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private apiUrl = environment.apiEndpoint;
  constructor() { }
  private scrollToLocationSource = new Subject<void>();

  scrollToLocation$ = this.scrollToLocationSource.asObservable();

  triggerScrollToLocation() {
    this.scrollToLocationSource.next();
  }

}
