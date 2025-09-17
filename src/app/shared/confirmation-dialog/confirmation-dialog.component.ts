import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="confirmation-dialog-container">
      <!-- Header Section -->
      <div class="dialog-header" mat-dialog-title>
        <div class="header-icon">
          <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z">
            </path>
          </svg>
        </div>
        <h2 class="dialog-title">Confirmación</h2>
      </div>

      <!-- Content Section -->
      <div class="dialog-content" mat-dialog-content>
        <p class="dialog-message">{{ data.message }}</p>
      </div>

      <!-- Actions Section -->
      <div class="dialog-actions" mat-dialog-actions>
        <button 
          mat-button 
          type="button"
          (click)="onNoClick()" 
          class="btn-cancel"
          aria-label="Cancelar acción">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Cancelar
        </button>
        <button 
          mat-button 
          type="button"
          [mat-dialog-close]="true" 
          class="btn-confirm"
          aria-label="Confirmar acción">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Confirmar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog-container {
      min-width: 400px;
      max-width: 500px;
      padding: 0;
      border-radius: 12px;
      overflow: hidden;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      padding: 24px 24px 16px 24px;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-bottom: 1px solid #f3f4f6;
    }

    .header-icon {
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(245, 158, 11, 0.1);
      border-radius: 50%;
    }

    .dialog-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      line-height: 1.5;
    }

    .dialog-content {
      padding: 24px;
      background: #ffffff;
    }

    .dialog-message {
      margin: 0;
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.6;
      text-align: center;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px 24px 24px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .btn-cancel {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      color: #6b7280;
      font-weight: 500;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }

    .btn-cancel:hover {
      border-color: #d1d5db;
      background: #f9fafb;
      color: #374151;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-cancel:focus {
      outline: none;
      ring: 2px solid #3b82f6;
      ring-offset: 2px;
    }

    .btn-confirm {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      border: 2px solid #10b981;
      border-radius: 8px;
      background: #10b981;
      color: #ffffff;
      font-weight: 500;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }

    .btn-confirm:hover {
      background: #059669;
      border-color: #059669;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
    }

    .btn-confirm:focus {
      outline: none;
      ring: 2px solid #10b981;
      ring-offset: 2px;
    }

    /* Responsive design */
    @media (max-width: 480px) {
      .confirmation-dialog-container {
        min-width: 320px;
        max-width: 90vw;
      }

      .dialog-header {
        padding: 20px 20px 12px 20px;
      }

      .dialog-content {
        padding: 20px;
      }

      .dialog-actions {
        flex-direction: column-reverse;
        gap: 8px;
        padding: 12px 20px 20px 20px;
      }

      .btn-cancel,
      .btn-confirm {
        width: 100%;
        justify-content: center;
      }
    }

    /* Animation for dialog entrance */
    .confirmation-dialog-container {
      animation: dialogFadeIn 0.3s ease-out;
    }

    @keyframes dialogFadeIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `]
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