import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService, Tournament } from '../../service/admin.service';
import { CategoriesService, Category } from '../../service/categories.service';

@Component({
  selector: 'app-tournament-dialog',
  templateUrl: './tournament-dialog.component.html',
  styleUrls: ['./tournament-dialog.component.scss']
})
export class TournamentDialogComponent implements OnInit {
  tournamentForm: FormGroup;
  categories: Category[] = [];
  selectedCategories: number[] = [];
  isLoading = false;
  isEditMode = false;
  categoriesLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private categoriesService: CategoriesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TournamentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tournament?: Tournament }
  ) {
    this.tournamentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date_from: ['', Validators.required],
      date_to: ['', Validators.required],
      category: this.fb.array([], Validators.required),
      active: [true]
    });

    this.isEditMode = !!data?.tournament;
  }

  ngOnInit(): void {
    this.loadCategories();
    
    if (this.isEditMode && this.data.tournament) {
      this.populateForm(this.data.tournament);
    }
  }

  async loadCategories() {
    try {
      this.categoriesLoading = true;
      this.categoriesService.getAllCategories().subscribe(
        (categories) => {
          this.categories = categories;
          this.categoriesLoading = false;
        },
        (error) => {
          console.error('Error loading categories:', error);
          this.toastr.error('Error al cargar las categorías');
          this.categoriesLoading = false;
        }
      );
    } catch (error) {
      console.error('Error loading categories:', error);
      this.toastr.error('Error al cargar las categorías');
      this.categoriesLoading = false;
    }
  }

  populateForm(tournament: Tournament) {
    this.tournamentForm.patchValue({
      name: tournament.name,
      description: tournament.description,
      date_from: this.formatDateForInput(tournament.date_from),
      date_to: this.formatDateForInput(tournament.date_to),
      active: tournament.active
    });

    // Handle categories
    if (tournament.category && Array.isArray(tournament.category)) {
      this.selectedCategories = [...tournament.category];
      const categoryArray = this.tournamentForm.get('category') as FormArray;
      
      tournament.category.forEach(categoryId => {
        categoryArray.push(this.fb.control(categoryId));
      });
    }
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onCategoryChange(event: any, categoryId: number) {
    const categoryArray = this.tournamentForm.get('category') as FormArray;
    
    if (event.target.checked) {
      categoryArray.push(this.fb.control(categoryId));
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index >= 0) {
        this.selectedCategories.splice(index, 1);
      }
      
      let i = 0;
      categoryArray.controls.forEach((ctrl) => {
        if (ctrl.value === categoryId) {
          categoryArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  async saveTournament() {
    if (this.tournamentForm.invalid) {
      this.tournamentForm.markAllAsTouched();
      this.toastr.error('Por favor complete todos los campos requeridos');
      return;
    }

    this.isLoading = true;
    const formData = this.tournamentForm.value;

    try {
      let result;
      
      if (this.isEditMode && this.data.tournament && this.data.tournament.id) {
        result = await this.adminService.updateTournament(this.data.tournament.id, formData);
        this.toastr.success('Torneo actualizado con éxito');
      } else {
        result = await this.adminService.createTournament(formData);
        this.toastr.success('Torneo creado con éxito');
      }
      
      this.dialogRef.close(result);
    } catch (error) {
      console.error('Error saving tournament:', error);
      this.toastr.error('Error al guardar el torneo');
    } finally {
      this.isLoading = false;
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
