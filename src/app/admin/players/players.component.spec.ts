import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayersComponent } from './players.component';
import { PlayersService } from '../service/players.service';
import { of } from 'rxjs';

describe('PlayersComponent', () => {
  let component: PlayersComponent;
  let fixture: ComponentFixture<PlayersComponent>;
  let playersService: PlayersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        PlayersComponent
      ],
      providers: [PlayersService]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
    playersService = TestBed.inject(PlayersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.playerForm.get('first_name')?.value).toBe('');
    expect(component.playerForm.get('last_name')?.value).toBe('');
    expect(component.playerForm.get('active')?.value).toBeTrue();
  });

  it('should load players on init', () => {
    const mockPlayers = [
      {
        id: 1,
        first_name: 'Juan',
        last_name: 'Pérez',
        dni: '12345678',
        birth_date: '1990-01-01',
        email: 'juan@example.com',
        phone: '123456789',
        address: 'Calle Principal 123',
        active: true
      }
    ];
    
    spyOn(playersService, 'getAllPlayers').and.returnValue(of(mockPlayers));
    
    component.ngOnInit();
    
    expect(playersService.getAllPlayers).toHaveBeenCalled();
    expect(component.players).toEqual(mockPlayers);
  });

  it('should calculate age correctly', () => {
    // Mock current date to ensure consistent test results
    jasmine.clock().mockDate(new Date(2025, 4, 7)); // May 7, 2025
    
    const birthDate = '1990-01-01';
    const expectedAge = 35; // Age as of May 7, 2025
    
    expect(component.calculateAge(birthDate)).toBe(expectedAge);
    
    jasmine.clock().uninstall();
  });

  it('should open create form with default values', () => {
    component.openCreateForm();
    
    expect(component.isEditMode).toBeFalse();
    expect(component.currentPlayerId).toBeNull();
    expect(component.showForm).toBeTrue();
    expect(component.photoFile).toBeNull();
    expect(component.photoPreview).toBeNull();
  });

  it('should open edit form with player data', () => {
    const mockPlayer = {
      id: 1,
      first_name: 'Juan',
      last_name: 'Pérez',
      dni: '12345678',
      birth_date: '1990-01-01',
      email: 'juan@example.com',
      phone: '123456789',
      address: 'Calle Principal 123',
      active: true
    };
    
    component.openEditForm(mockPlayer);
    
    expect(component.isEditMode).toBeTrue();
    expect(component.currentPlayerId).toBe(1);
    expect(component.showForm).toBeTrue();
    expect(component.playerForm.get('first_name')?.value).toBe('Juan');
    expect(component.playerForm.get('last_name')?.value).toBe('Pérez');
  });
});
