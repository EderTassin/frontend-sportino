import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { FrontPageImage } from 'src/app/admin/service/manager-img.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private apiUrl = environment.apiEndpoint;
  constructor(private http: HttpClient) { }
    private scrollToLocationSource = new Subject<void>();

  scrollToLocation$ = this.scrollToLocationSource.asObservable();

  triggerScrollToLocation() {
    this.scrollToLocationSource.next();
  }
}
