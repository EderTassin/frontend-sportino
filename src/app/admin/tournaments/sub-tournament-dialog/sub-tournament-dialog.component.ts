import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tournament } from '../../service/admin.service';
import { EstadisticaPartidosService } from 'src/app/home/tabla-fixture/service/estadistica-partidos.service';

@Component({
  selector: 'app-sub-tournament-dialog',
  templateUrl: './sub-tournament-dialog.component.html',
  styleUrls: ['./sub-tournament-dialog.component.scss']
})
export class SubTournamentDialogComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  selectedCategories: number[] = [];
  parentTournament: any;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubTournamentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parentTournament: any },
    private estadisticaService: EstadisticaPartidosService
  ) {
    this.parentTournament = data.parentTournament;
    
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [this.parentTournament.description || ''],
      date_from: [this.parentTournament.date_from, Validators.required],
      date_to: [this.parentTournament.date_to, Validators.required],
      category: [this.parentTournament.category || [], Validators.required]
    });
    
    if (this.parentTournament.category && Array.isArray(this.parentTournament.category)) {
      this.selectedCategories = [...this.parentTournament.category];
    }
  }

  ngOnInit(): void {
    this.getCategories();
  }

  async getCategories() {
    try {
      this.categories = await this.estadisticaService.getCategories();
    } catch (error) {
      console.error("Error fetching categories", error);
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

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
