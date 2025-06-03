import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadisticaPartidosService } from 'src/app/home/tabla-fixture/service/estadistica-partidos.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface Tournament {
  id?: number;
  name: string;
  description?: string;
  date_from: string;
  date_to: string;
  active: boolean;
  category: number[];
}

interface TournamentDate {
  id?: number;
  date: string;
  tournament: number[];
  active: boolean;
}

interface TournamentMatch {
  date: string;
  team1: number;
  team2: number;
  tournament: number;
  active: boolean;
}

@Component({
  selector: 'app-tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.scss']
})
export class TournamentFormComponent implements OnInit {
  @Input() initialData: any;
  @Input() isEditMode: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formValid = new EventEmitter<boolean>();

  currentStep: number = 1;

  categories: any[] = [];
  form: FormGroup;
  selectedCategories: number[] = [];

  constructor(private tournamentService: EstadisticaPartidosService, private fb: FormBuilder, private toastr: ToastrService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      date_from: ['', Validators.required],
      date_to: ['', Validators.required],
      category: [[], Validators.required]
    });
    this.form.statusChanges.subscribe(status => {
      this.formValid.emit(status === 'VALID');
    });
  }

  ngOnInit() {
    this.getCategories();
  
    if (this.initialData && this.initialData[0]) {
      const dataToPatch = {
        name: this.initialData[0].name || '',
        description: this.initialData[0].description || '',
        date_from: this.initialData[0].date_from || '',
        date_to: this.initialData[0].date_to || '',
        category: this.initialData[0].category || []
      };
      this.form.patchValue(dataToPatch);
      this.selectedCategories = dataToPatch.category;
      
      this.formValid.emit(this.form.valid);
    } else {
      this.formValid.emit(this.form.valid);
    }
  }

  async getCategories() {
    try {
      this.categories = await this.tournamentService.getCategories();
    } catch (error) {
      console.error("Error fetching categories", error);
      this.toastr.error("Error al cargar las categorías.");
      this.categories = [];
    }
  }
  
  onCategoryChange(event: any, categoryId: number) {
    if (event.target.checked) {
      if (!this.selectedCategories.includes(categoryId)) {
         this.selectedCategories.push(categoryId);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.form.patchValue({ category: this.selectedCategories });
    this.form.get('category')?.markAsDirty();
  }

  getFormData() {
    if (this.form.valid) {
      return { ...this.form.value };
    }
    this.form.markAllAsTouched();
    console.warn("Tournament form is invalid", this.form.errors);
    return null;
  }

  isCategorySelected(categoryId: number): boolean {
      return this.selectedCategories.includes(categoryId);
  }
}
