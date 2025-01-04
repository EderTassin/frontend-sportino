import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="p-4">
      <h2 mat-dialog-title>Confirmación</h2>
      <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div class="d-flex justify-content-between">
      <button mat-button (click)="onNoClick()" class="m-2 p-2 border-solid border-2 border-red-500 rounded-md text-bold bg-red-100">No</button>
      <button mat-button class="m-2 p-2 border-solid border-2 border-green-500 rounded-md text-bold bg-green-100" [mat-dialog-close]="true">Sí</button>
      </div>
    </div>
  `
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}