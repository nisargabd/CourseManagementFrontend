import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CourseService } from '../../services/course.service';
import { Course, CourseFilter } from '../../models/course.model';
import { JoinListPipe } from '../../pipes/join-list.pipe';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    JoinListPipe,
    ConfirmDialogComponent
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  filters: CourseFilter = {};

  // Filter options
  boardOptions = ['State', 'CBSE', 'ICSE'];
  mediumOptions = ['English', 'Hindi', 'Telugu'];
  gradeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  subjectOptions = [
    'English', 'Hindi', 'Maths', 'Science', 'Social', 
    'Physics', 'Chemistry', 'Biology', 'History', 
    'Geography', 'Civics', 'Computer'
  ];

  constructor(
    private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = Array.isArray(courses) ? courses : [];
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.courses = [];
        this.filteredCourses = [];
      }
    });
  }

  applyFilters(): void {
    // Ensure courses is always an array
    if (!Array.isArray(this.courses)) {
      this.courses = [];
    }
    
    this.filteredCourses = this.courses.filter(course => {
      // Search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const matchesSearch = 
          course.name.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Board filter
      if (this.filters.board && course.board !== this.filters.board) {
        return false;
      }

      // Medium filter
      if (this.filters.medium && !course.medium.includes(this.filters.medium)) {
        return false;
      }

      // Grade filter
      if (this.filters.grade && !course.grade.includes(this.filters.grade)) {
        return false;
      }

      // Subject filter
      if (this.filters.subject && !course.subject.includes(this.filters.subject)) {
        return false;
      }

      return true;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filters = {};
    this.applyFilters();
  }

  navigateToCourse(courseId: string): void {
    this.router.navigate(['/courses/view', courseId]);
  }

  editCourse(courseId: string): void {
    this.router.navigate(['/courses/edit', courseId]);
  }

  addNewCourse(): void {
    this.router.navigate(['/courses/add']);
  }

  deleteCourse(courseId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Course',
        message: 'Are you sure you want to delete this course? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteCourse(courseId).subscribe({
          next: () => {
            this.snackBar.open('Course deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.loadCourses();
          },
          error: (error) => {
            console.error('Error deleting course:', error);
            this.snackBar.open('Error deleting course', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }
}

