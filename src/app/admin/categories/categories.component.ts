import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService, Category } from '../service/categories.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditMode = false;
  currentCategoryId: number | null = null;
  showForm = false;
  loading = false;
  error = '';

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      age_from: [0, [Validators.required, Validators.min(0)]],
      age_to: [0, [Validators.required, Validators.min(0)]],
      observations: [''],
      period: [0, [Validators.required, Validators.min(0)]],
      period_s: [0, [Validators.required, Validators.min(0)]],
      period_g: [0, [Validators.required, Validators.min(0)]],
      period_tr: [0, [Validators.required, Validators.min(0)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading categories';
        console.error(err);
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.currentCategoryId = null;
    this.categoryForm.reset({
      name: '',
      age_from: 0,
      age_to: 0,
      observations: '',
      period: 0,
      period_s: 0,
      period_g: 0,
      period_tr: 0,
      active: true
    });
    this.showForm = true;
  }

  openEditForm(category: Category): void {
    this.isEditMode = true;
    this.currentCategoryId = category.id || null;
    this.categoryForm.patchValue({
      name: category.name,
      age_from: category.age_from,
      age_to: category.age_to,
      observations: category.observations,
      period: category.period,
      period_s: category.period_s,
      period_g: category.period_g,
      period_tr: category.period_tr,
      active: category.active
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.error = '';
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const category: Category = this.categoryForm.value;
    this.loading = true;
    
    if (this.isEditMode && this.currentCategoryId) {
      this.categoriesService.updateCategory(this.currentCategoryId, category).subscribe({
        next: () => {
          this.loadCategories();
          this.showForm = false;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error updating category';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.categoriesService.createCategory(category).subscribe({
        next: () => {
          this.loadCategories();
          this.showForm = false;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error creating category';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.loading = true;
      this.categoriesService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error deleting category';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
