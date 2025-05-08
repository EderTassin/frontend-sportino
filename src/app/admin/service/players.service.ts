import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Player {
  id?: number;
  full_name: string;
  birthday: string;
  id_card: string;
  year: string;
  street: string;
  number: string;
  neighborhood: string;
  phone: string;
  cell_phone: string;
  email: string;
  picture_file: string;
  medical_certificate: boolean;
  date_certificate: string;
  date: string;
  team?: Team;
  team_name?: string;
  position?: string;
  jersey_number?: number;
  active: boolean;
  photo_url?: string;
  active_sanctions: boolean;
}

export interface Team {
  id: number;
  name: string;
}

export interface PlayerResponse {
  count: number;
  next: string;
  previous: string;
  results: Player[];
}

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private apiUrl = `${environment.apiEndpoint}players/`;

  constructor(private http: HttpClient) { }

  getAllPlayers(page: number = 1, filters?: {full_name?: string, team_name?: string}): Observable<PlayerResponse> {
    let url = `${this.apiUrl}players/?page=${page}`;
    
    // Añadir filtros si están presentes
    if (filters) {
      if (filters.full_name) {
        url += `&full_name=${encodeURIComponent(filters.full_name)}`;
      }
      if (filters.team_name) {
        url += `&team_name=${encodeURIComponent(filters.team_name)}`;
      }
    }
    
    return this.http.get<PlayerResponse>(url);
  }

  getPlayerById(id: number): Observable<Player> {
    const url = `${this.apiUrl}players/${id}/`;
    return this.http.get<Player>(url);
  }

  createPlayer(player: Player, pictureFile?: File): Observable<Player> {
    const url = `${this.apiUrl}players/`;
    const formData = new FormData();
    
    if (player.full_name) formData.append('full_name', player.full_name);
    if (player.birthday) formData.append('birthday', player.birthday);
    if (player.id_card) formData.append('id_card', player.id_card);
    if (player.year) formData.append('year', player.year);
    if (player.street) formData.append('street', player.street);
    if (player.number) formData.append('number', player.number);
    if (player.neighborhood) formData.append('neighborhood', player.neighborhood);
    if (player.phone) formData.append('phone', player.phone);
    if (player.cell_phone) formData.append('cell_phone', player.cell_phone);
    if (player.email) formData.append('email', player.email);
    if (player.date_certificate) formData.append('date_certificate', player.date_certificate);
    if (player.date) formData.append('date', player.date);
    if (player.team) formData.append('team', player.team.id.toString());
    if (player.position) formData.append('position', player.position);
    if (player.jersey_number) formData.append('jersey_number', player.jersey_number.toString());
    
    formData.append('medical_certificate', player.medical_certificate ? 'true' : 'false');
    formData.append('active', player.active ? 'true' : 'false');
    
    if (pictureFile) {
      formData.append('picture_file', pictureFile);
    }
    
    return this.http.post<Player>(url, formData);
  }

  updatePlayer(id: number, player: Player, pictureFile?: File): Observable<Player> {
    const url = `${this.apiUrl}players/${id}/`;
    const formData = new FormData();
  
    console.log(player);

    if (player.full_name) formData.append('full_name', player.full_name);
    if (player.birthday) formData.append('birthday', player.birthday);
    if (player.id_card) formData.append('id_card', player.id_card);
    if (player.year) formData.append('year', player.year);
    if (player.street) formData.append('street', player.street);
    if (player.number) formData.append('number', player.number);
    if (player.neighborhood) formData.append('neighborhood', player.neighborhood);
    if (player.phone) formData.append('phone', player.phone);
    if (player.cell_phone) formData.append('cell_phone', player.cell_phone);
    if (player.email) formData.append('email', player.email);
    if (player.date_certificate) formData.append('date_certificate', player.date_certificate);
    if (player.date) formData.append('date', player.date);
    if (player.position) formData.append('position', player.position);
    // Manejo del campo team que funciona con diferentes formatos
    if (player.team) {
      if (typeof player.team === 'object' && player.team.id) {
        // Si es un objeto Team con id
        formData.append('team', player.team.id.toString());
      } else if (typeof player.team === 'string' || typeof player.team === 'number') {
        // Si es directamente un ID (string o número)
        formData.append('team', String(player.team));
      }
      console.log('Team appended:', player.team);
    }
    if (player.jersey_number) formData.append('jersey_number', player.jersey_number.toString());
    
    formData.append('medical_certificate', player.medical_certificate ? 'true' : 'false');
    formData.append('active', player.active ? 'true' : 'false');
    
    if (pictureFile) {
      formData.append('picture_file', pictureFile);
    }
    
    return this.http.put<Player>(url, formData);
  }

  deletePlayer(id: number): Observable<any> {
    const url = `${this.apiUrl}players/${id}/`;
    return this.http.delete(url, {
      headers: {
        'accept': 'application/json'
      }
    });
  }

  getPlayersByTeam(teamId: number): Observable<PlayerResponse> {
    const url = `${this.apiUrl}players/?team=${teamId}`;
    return this.http.get<PlayerResponse>(url);
  }

  uploadPlayerPhoto(id: number, photo: File): Observable<any> {
    const url = `${this.apiUrl}players/${id}/`;
    const formData = new FormData();
    formData.append('picture_file', photo);
    return this.http.patch<any>(url, formData);
  }
}
