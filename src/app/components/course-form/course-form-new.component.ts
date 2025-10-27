import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService } from '../../services/course.service';
import { UnitService } from '../../services/unit.service';
import { Course } from '../../models/course.model';
import { Unit } from '../../models/unit.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  courseId: string | null = null;
  availableUnits: Unit[] = [];
  selectedUnits: string[] = [];

  // Form options
  boardOptions = ['State', 'CBSE', 'ICSE'];
  mediumOptions = ['English', 'Hindi', 'Telugu'];
  gradeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  subjectOptions = [
    'English', 'Hindi', 'Maths', 'Science', 'Social', 
    'Physics', 'Chemistry', 'Biology', 'History', 
    'Geography', 'Civics', 'Computer'
  ];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private unitService: UnitService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      board: ['', Validators.required],
      medium: [[], [Validators.required, Validators.minLength(1)]],
      grade: [[], [Validators.required, Validators.minLength(1)]],
      subject: [[], [Validators.required, Validators.minLength(1)]],
      units: [[]]
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;
    
    if (this.isEditMode && this.courseId) {
      this.loadCourseForEdit();
    }
    
    this.loadAvailableUnits();
  }

  loadCourseForEdit(): void {
    if (!this.courseId) return;
    
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          name: course.name,
          description: course.description,
          board: course.board,
          medium: course.medium || [],
          grade: course.grade || [],
          subject: course.subject || [],
          units: course.units || []
        });
        this.selectedUnits = course.units?.map(unit => unit.id).filter((id): id is string => id !== undefined) || [];
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.snackBar.open('Error loading course for editing', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  loadAvailableUnits(): void {
    this.unitService.getUnitsByCourse(this.courseId || '').subscribe({
      next: (units) => {
        this.availableUnits = units;
      },
      error: (error) => {
        console.error('Error loading units:', error);
        this.availableUnits = [];
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.courseForm.value;
      
      // Build units array from selectedUnits with full unit data
      const unitsForCourse = this.selectedUnits.map(unitId => {
        const unit = this.availableUnits.find(u => u.id === unitId);
        return {
          id: unitId,
          title: unit?.title || '',
          content: unit?.content || ''
        };
      });
      
      const courseData: Course = {
        name: formValue.name,
        description: formValue.description,
        board: formValue.board,
        medium: formValue.medium,
        grade: formValue.grade,
        subject: formValue.subject,
        units: unitsForCourse
      };

      if (this.isEditMode && this.courseId) {
        this.updateCourse(courseData);
      } else {
        this.createCourse(courseData);
      }
    }
  }

  createCourse(courseData: Course): void {
    this.courseService.createCourse(courseData).subscribe({
      next: (createdCourse) => {
        this.snackBar.open('Course created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Error creating course:', error);
        this.snackBar.open('Error creating course', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isSubmitting = false;
      }
    });
  }

  updateCourse(courseData: Course): void {
    if (!this.courseId) return;
    
    this.courseService.updateCourse(this.courseId, courseData).subscribe({
      next: (updatedCourse) => {
        this.snackBar.open('Course updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Error updating course:', error);
        this.snackBar.open('Error updating course', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }

  onUnitSelectionChange(unitIds: string[]): void {
    this.selectedUnits = unitIds;
  }

  openAddUnitDialog(): void {
    const dialogRef = this.dialog.open(AddUnitDialogComponent, {
      width: '500px',
      data: { courseId: this.courseId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAvailableUnits();
      }
    });
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Course' : 'Add Course';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Update Course' : 'Create Course';
  }
}

// Add Unit Dialog Component
@Component({
  selector: 'app-add-unit-dialog',
  template: `
    <h2 mat-dialog-title>Add New Unit</h2>
    <mat-dialog-content>
      <form [formGroup]="unitForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Unit Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter unit title">
          <mat-error *ngIf="unitForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
          <mat-error *ngIf="unitForm.get('title')?.hasError('minlength')">
            Title must be at least 3 characters
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Unit Content</mat-label>
          <textarea matInput formControlName="content" rows="4" placeholder="Enter unit content"></textarea>
          <mat-error *ngIf="unitForm.get('content')?.hasError('required')">
            Content is required
          </mat-error>
          <mat-error *ngIf="unitForm.get('content')?.hasError('minlength')">
            Content must be at least 10 characters
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true" [disabled]="!unitForm.valid" color="primary">
        Add Unit
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 16px; }
  `],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule]
})
export class AddUnitDialogComponent {
  unitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.unitForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
}
