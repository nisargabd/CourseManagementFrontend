import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UnitService } from '../../services/unit.service';
import { Unit } from '../../models/course.model';

@Component({
  selector: 'app-add-unit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Unit</h2>
    <mat-dialog-content>
      <form [formGroup]="unitForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Unit Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter unit name">
          <mat-error *ngIf="unitForm.get('name')?.invalid && unitForm.get('name')?.touched">
            Unit name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Enter unit description"></textarea>
          <mat-error *ngIf="unitForm.get('description')?.invalid && unitForm.get('description')?.touched">
            Description is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="unitForm.invalid || isSubmitting"
              (click)="onSubmit()">
        {{ isSubmitting ? 'Adding...' : 'Add Unit' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class AddUnitDialogComponent {
  unitForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private unitService: UnitService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddUnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId?: string }
  ) {
    this.unitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.unitForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const unitData: Unit = {
        ...this.unitForm.value,
        courseId: this.data.courseId
      };

      this.unitService.createUnit(unitData).subscribe({
        next: (createdUnit) => {
          this.snackBar.open('Unit created successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.dialogRef.close(createdUnit);
        },
        error: (error) => {
          console.error('Error creating unit:', error);
          this.snackBar.open('Error creating unit', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
        }
      });
    }
  }
}
