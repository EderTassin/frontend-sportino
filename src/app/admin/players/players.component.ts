import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlayersService, Player, Team } from '../service/players.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  allLoadedPlayers: Player[] = [];
  playerForm: FormGroup;
  isEditMode = false;
  currentPlayerId: number | null = null;
  showForm = false;
  loading = false;
  error = '';
  apiUrl = `${environment.apiEndpoint}`;

  // Search property
  searchTerm = '';
  isSearching = false;
  
  // Pagination properties
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  nextPageUrl: string | null = null;
  previousPageUrl: string | null = null;
  photoFile: File | null = null;
  photoPreview: string | null = null;
  teams: Team[] = [];

  constructor(
    private playersService: PlayersService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.playerForm = this.fb.group({
      full_name: ['', [Validators.required]],
      id_card: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      year: [''],
      street: [''],
      number: [''],
      neighborhood: [''],
      phone: [''],
      cell_phone: [''],
      email: ['', [Validators.email]],
      team: [null],
      position: [''],
      jersey_number: [null],
      medical_certificate: [false],
      date_certificate: [''],
      date: [''],
      active: [true],
      active_sanctions: [false]
    });

    this.apiUrl = environment.apiEndpoint.replace('/api/', '');
  }

  ngOnInit(): void {
    this.loadPlayers();
    this.getTeams();
  }

  async getTeams() {
    this.teams = await this.adminService.getTeams();
    console.log(this.teams);
  }

  loadPlayers(page: number = 1): void {
    this.loading = true;
    this.playersService.getAllPlayers(page).subscribe({
      next: (data) => {
        this.players = data.results;
        this.filteredPlayers = [...this.players];
        
        // Store these players in our all loaded players array if not already there
        const newPlayerIds = data.results.map(player => player.id);
        this.allLoadedPlayers = [
          ...this.allLoadedPlayers.filter(player => !newPlayerIds.includes(player.id)),
          ...data.results
        ];
        
        this.totalItems = data.count;
        this.nextPageUrl = data.next;
        this.previousPageUrl = data.previous;
        this.currentPage = page;
        this.totalPages = Math.ceil(this.totalItems / this.players.length);
        this.loading = false;
        
        // If we're in search mode, apply the filter
        if (this.isSearching && this.searchTerm) {
          this.applyFilter();
        }
      },
      error: (err) => {
        this.error = 'Error loading players';
        console.error(err);
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.currentPlayerId = null;
    this.playerForm.reset({
      full_name: '',
      id_card: '',
      birthday: '',
      year: '',
      street: '',
      number: '',
      neighborhood: '',
      phone: '',
      cell_phone: '',
      email: '',
      team: null,
      position: '',
      jersey_number: null,
      medical_certificate: false,
      date_certificate: '',
      date: '',
      active: true,
      active_sanctions: false
    });
    this.photoFile = null;
    this.photoPreview = null;
    this.showForm = true;
  }

  openEditForm(player: Player): void {
    this.isEditMode = true;
    this.currentPlayerId = player.id || null;
    this.playerForm.patchValue({
      full_name: player.full_name,
      id_card: player.id_card,
      birthday: player.birthday,
      year: player.year,
      street: player.street,
      number: player.number,
      neighborhood: player.neighborhood,
      phone: player.phone,
      cell_phone: player.cell_phone,
      email: player.email,
      team: player.team,
      position: player.position,
      jersey_number: player.jersey_number,
      medical_certificate: player.medical_certificate,
      date_certificate: player.date_certificate,
      picture_file: player.picture_file,
      date: player.date,
      active: player.active,
      active_sanctions: player.active_sanctions
    });
    this.photoPreview = this.apiUrl + player.picture_file || null;
    this.photoFile = null;
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.error = '';
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photoFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.photoFile);
    }
  }

  savePlayer(): void {

    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    const player: Player = this.playerForm.value;
    this.loading = true;
    
    if (this.isEditMode && this.currentPlayerId) {
      // Actualizar jugador con foto en una sola operación
      this.playersService.updatePlayer(this.currentPlayerId, player, this.photoFile || undefined).subscribe({
        next: () => {
          this.finishSave();
        },
        error: (err) => {
          this.error = 'Error updating player';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      // Crear jugador con foto en una sola operación
      this.playersService.createPlayer(player, this.photoFile || undefined).subscribe({
        next: () => {
          this.finishSave();
        },
        error: (err) => {
          this.error = 'Error creating player';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  uploadPhoto(playerId: number): void {
    if (!this.photoFile) {
      this.finishSave();
      return;
    }

    // Este método ahora es más simple ya que usamos PATCH para actualizar solo la foto
    this.playersService.uploadPlayerPhoto(playerId, this.photoFile).subscribe({
      next: () => {
        this.finishSave();
      },
      error: (err) => {
        this.error = 'Error uploading photo';
        console.error(err);
        this.loading = false;
        this.loadPlayers();
      }
    });
  }

  finishSave(): void {
    this.loadPlayers();
    this.showForm = false;
    this.loading = false;
    this.photoFile = null;
  }

  deletePlayer(id: number): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.loading = true;
      this.playersService.deletePlayer(id).subscribe({
        next: () => {
          this.loadPlayers();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error deleting player';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  calculateAge(birthDateString: string): number {
    if (!birthDateString) return 0;
    
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return 0;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
  
  // Search method
  search(): void {
    if (!this.searchTerm.trim()) {
      this.clearSearch();
      return;
    }
    
    this.isSearching = true;
    this.applyFilter();
  }
  
  // Apply filter to current data
  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    // First try to filter the current page
    this.filteredPlayers = this.players.filter(player => 
      this.playerMatchesSearch(player, term)
    );
    
    // If no results on current page but we have more pages and haven't searched all data yet
    if (this.filteredPlayers.length === 0 && this.nextPageUrl && this.isSearching) {
      // Try to find in already loaded players from other pages
      const matchesFromLoaded = this.allLoadedPlayers.filter(player => 
        this.playerMatchesSearch(player, term)
      );
      
      if (matchesFromLoaded.length > 0) {
        this.filteredPlayers = matchesFromLoaded;
      } else {
        // Load next page and search there
        this.loadNextPageAndSearch();
      }
    }
  }
  
  // Helper to check if a player matches the search term
  playerMatchesSearch(player: Player, term: string): boolean {
    return (
      (player.full_name?.toLowerCase().includes(term) ?? false) ||
      (player.id_card?.toLowerCase().includes(term) ?? false) ||
      (player.team_name?.toLowerCase().includes(term) ?? false) ||
      (player.position?.toLowerCase().includes(term) ?? false)
    );
  }
  
  // Load next page and continue searching
  loadNextPageAndSearch(): void {
    if (this.nextPageUrl && this.isSearching) {
      this.loadPlayers(this.currentPage + 1);
    }
  }
  
  // Clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.isSearching = false;
    this.filteredPlayers = [...this.players];
  }
  
  // Pagination methods
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.loadPlayers(page);
  }
  
  goToNextPage(): void {
    if (this.nextPageUrl) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  goToPreviousPage(): void {
    if (this.previousPageUrl) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
