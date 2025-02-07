import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadisticaPartidosService } from 'src/app/home/tabla-fixture/service/estadistica-partidos.service';

@Component({
  selector: 'app-tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.scss']
})
export class TournamentFormComponent implements OnInit {
  @Input() initialData: any;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formValid = new EventEmitter<boolean>();

  categories: any[] = [];
  form: FormGroup;
  selectedCategories: number[] = [];

  constructor(private tournamentService: EstadisticaPartidosService, private fb: FormBuilder) {
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

    if (this.initialData[0]) {
      this.form.patchValue(this.initialData[0]);
    }
  }

  async getCategories() {
    this.categories = await this.tournamentService.getCategories();
  }
  
  onCategoryChange(event: any, categoryId: number) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.form.patchValue({ categories: this.selectedCategories });
  }

  getFormData() {
    if (this.form.valid) {
      return this.form.value;
    }
    this.form.markAllAsTouched();
    return null;
  }
}
