
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface FrontPageImage {
  id: number;
  image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManagerImgService {

  constructor(private http: HttpClient) { }

  uploadImage(teamId: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('teamId', teamId.toString());
    formData.append('image', image);
    return this.http.post<any>(`${environment.apiEndpoint}manager/img`, formData);
  }

  getFrontPageImages(): Observable<FrontPageImage[]> {
    return this.http.get<FrontPageImage[]>(`${environment.apiEndpoint}gallerys/FrontPageImages/`);
  }

  uploadFrontPageImage(image: File, active: boolean = true): Observable<FrontPageImage> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('image', image, image.name);
    formData.append('active', active.toString());
    
    return this.http.post<FrontPageImage>(
      `${environment.apiEndpoint}gallerys/FrontPageImages/`, 
      formData, 
      { 
        headers,
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(
      catchError(error => {
        console.error('Detailed upload error:', error);
        throw error;
      }),
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          return null as any;
        } else if (event.type === HttpEventType.Response) {
          return event.body as FrontPageImage;
        }
        return null as any;
      }),
      filter(response => response !== null)
    );
  }

  toggleFrontPageImageStatus(id: number, active: boolean): Observable<FrontPageImage> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put<FrontPageImage>(`${environment.apiEndpoint}gallerys/FrontPageImages/${id}/`, { active }, { headers } );
  }

  deleteFrontPageImage(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete<any>(`${environment.apiEndpoint}gallerys/FrontPageImages/${id}/`, { headers });
  }
}
