# 📚 Angular Course Management System - Complete Study Guide

## Table of Contents
1. [Project Architecture Overview](#1-project-architecture-overview)
2. [Angular Core Concepts](#2-angular-core-concepts)
3. [Component Architecture](#3-component-architecture)
4. [Services and Dependency Injection](#4-services-and-dependency-injection)
5. [Routing and Navigation](#5-routing-and-navigation)
6. [Forms and Validation](#6-forms-and-validation)
7. [HTTP Communication](#7-http-communication)
8. [RxJS and Observables](#8-rxjs-and-observables)
9. [Angular Material](#9-angular-material)
10. [Project Structure](#10-project-structure)
11. [Best Practices Used](#11-best-practices-used)

---

## 1. Project Architecture Overview

### What is Angular?
Angular is a **TypeScript-based** web application framework developed by Google. It follows the **Component-Based Architecture** pattern.

### Your Project Stack
```
Frontend: Angular 17 (Standalone Components)
UI Library: Angular Material 17
Language: TypeScript 5.2
Styling: SCSS
State Management: Services with RxJS
Backend Communication: HttpClient
```

### Architecture Pattern: MVC (Model-View-Controller)
```
Model      → models/course.model.ts, models/unit.model.ts
View       → *.component.html (Templates)
Controller → *.component.ts (Component Classes)
```

---

## 2. Angular Core Concepts

### 2.1 Modules vs Standalone Components

**Traditional Approach (NgModules):**
```typescript
// OLD WAY - Not used in your project
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
```

**Modern Approach (Standalone Components) - What YOU use:**
```typescript
@Component({
  selector: 'app-root',
  standalone: true,  // ✅ This is the key!
  imports: [RouterModule, MatToolbarModule],
  templateUrl: './app.component.html'
})
```

**Why Standalone?**
- ✅ Simpler code - no NgModule boilerplate
- ✅ Better tree-shaking (smaller bundle size)
- ✅ Easier lazy loading
- ✅ More flexible component organization

**Your Implementation:**
Every component in your project is standalone:
- `AppComponent`
- `CourseListComponent`
- `CourseDetailComponent`
- `CourseFormComponent`
- `UnitFormComponent`
- `ConfirmDialogComponent`
- `AddUnitDialogComponent`

---

### 2.2 Decorators

**What are Decorators?**
Decorators are TypeScript features that add metadata to classes, methods, properties, or parameters. They start with `@`.

**Decorators Used in Your Project:**

#### `@Component` - Defines a Component
```typescript
@Component({
  selector: 'app-course-list',     // HTML tag name
  standalone: true,                 // Standalone mode
  imports: [CommonModule, ...],     // Dependencies
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
```

#### `@Injectable` - Makes a Class Injectable
```typescript
@Injectable({
  providedIn: 'root'  // Singleton service available app-wide
})
export class CourseService { }
```

#### `@Pipe` - Creates Custom Pipes
```typescript
@Pipe({
  name: 'joinList',
  standalone: true
})
export class JoinListPipe implements PipeTransform { }
```

#### `@Inject` - Dependency Injection
```typescript
constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
```

---

### 2.3 TypeScript Interfaces

**Purpose:** Define the shape/structure of data

**Your Models:**

```typescript
// course.model.ts
export interface Course {
  id?: string;           // Optional (? means optional)
  name: string;          // Required
  description: string;
  board: string;
  medium: string[];      // Array of strings
  grade: string[];
  subject: string[];
  units?: Unit[];        // Optional array of Unit objects
}

export interface CourseFilter {
  board?: string;
  medium?: string;
  grade?: string;
  subject?: string;
  search?: string;
}
```

**Why Interfaces?**
- ✅ Type safety - catches errors at compile time
- ✅ Autocomplete in IDE
- ✅ Self-documenting code
- ✅ Refactoring support

---

## 3. Component Architecture

### 3.1 Component Lifecycle Hooks

**What are Lifecycle Hooks?**
Methods that Angular calls at specific moments in a component's life.

**Lifecycle Order:**
```
1. constructor()        → Create component instance
2. ngOnInit()          → Initialize component (API calls here!)
3. ngOnChanges()       → When input properties change
4. ngDoCheck()         → Custom change detection
5. ngAfterViewInit()   → After view is initialized
6. ngOnDestroy()       → Cleanup before destruction
```

**Your Implementation - CourseDetailComponent:**
```typescript
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  // ✅ Best practice: API calls in ngOnInit, NOT constructor
  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(courseId);
    }
  }
}
```

**Why ngOnInit() instead of constructor()?**
- Constructor is for dependency injection only
- ngOnInit ensures all inputs are set
- ngOnInit is called after Angular initializes the component

---

### 3.2 Component Communication

#### 1. Parent to Child - `@Input()`
```typescript
// Not heavily used in your project, but useful to know
@Input() course!: Course;  // Receives data from parent
```

#### 2. Child to Parent - `@Output()` and EventEmitter
```typescript
@Output() courseDeleted = new EventEmitter<string>();

deleteCourse() {
  this.courseDeleted.emit(this.courseId);
}
```

#### 3. Through Services - What YOU use!
```typescript
// CourseListComponent
this.courseService.getAllCourses().subscribe(courses => {
  this.courses = courses;
});

// CourseDetailComponent (different component)
this.courseService.getCourseById(id).subscribe(course => {
  this.course = course;
});
```

**Why Services for Communication?**
- ✅ Works between any components (not just parent-child)
- ✅ Centralized data management
- ✅ Easier to test
- ✅ Reusable across the app

---

### 3.3 Component Template Syntax

#### Property Binding `[]`
```html
<!-- Binds component property to element property -->
<input [value]="searchTerm">
<button [disabled]="isSubmitting">
```

#### Event Binding `()`
```html
<!-- Binds element event to component method -->
<button (click)="addNewCourse()">
<input (ngModelChange)="onSearchChange()">
```

#### Two-Way Binding `[()]`
```html
<!-- Combines property and event binding -->
<input [(ngModel)]="searchTerm">
<!-- Same as: -->
<input [ngModel]="searchTerm" (ngModelChange)="searchTerm = $event">
```

#### Interpolation `{{ }}`
```html
<!-- Displays component property value -->
<h1>{{ title }}</h1>
<p>{{ course.name }}</p>
```

#### Structural Directives `*`
```html
<!-- *ngIf - Conditional rendering -->
<div *ngIf="course">Content shows if course exists</div>

<!-- *ngFor - Loop rendering -->
<mat-card *ngFor="let course of filteredCourses">
  {{ course.name }}
</mat-card>

<!-- *ngIf with else -->
<div *ngIf="loading; else content">Loading...</div>
<ng-template #content>
  <p>Content here</p>
</ng-template>
```

---

## 4. Services and Dependency Injection

### 4.1 What is a Service?

**Definition:** A class that provides specific functionality, typically shared across components.

**Your Services:**
- `CourseService` - CRUD operations for courses
- `UnitService` - CRUD operations for units

### 4.2 Dependency Injection (DI)

**What is DI?**
Design pattern where a class receives its dependencies from external sources rather than creating them.

**Without DI (BAD):**
```typescript
export class CourseListComponent {
  courseService = new CourseService();  // ❌ Tightly coupled
}
```

**With DI (GOOD) - Your Way:**
```typescript
export class CourseListComponent {
  constructor(private courseService: CourseService) {}
  // Angular creates and injects CourseService automatically ✅
}
```

**Benefits:**
- ✅ Loose coupling
- ✅ Easy to test (can inject mock services)
- ✅ Singleton pattern (same instance shared)
- ✅ Angular manages lifecycle

---

### 4.3 Service Implementation - CourseService

```typescript
@Injectable({
  providedIn: 'root'  // Singleton - one instance for entire app
})
export class CourseService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<PaginatedResponse<Course>>(`${this.baseUrl}/courses/get`)
      .pipe(
        map(response => response.content || [])
      );
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<ApiEnvelope<Course>>(`${this.baseUrl}/courses/get/${id}`)
      .pipe(
        map(response => response.result.data)
      );
  }
}
```

**Key Points:**
- `private baseUrl` - Encapsulation
- `HttpClient` injected via constructor
- Returns `Observable` for async operations
- Uses `pipe()` and `map()` for data transformation

---

## 5. Routing and Navigation

### 5.1 Router Configuration

**Your Routes (app-routing.module.ts):**
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/view/:id', component: CourseDetailComponent },
  { path: 'courses/edit/:id', component: CourseFormComponent },
  { path: 'courses/add', component: CourseFormComponent },
  { path: 'createUnit', component: UnitFormComponent },
  { path: '**', redirectTo: '/courses' }  // Wildcard - 404
];
```

**Route Concepts:**

1. **Redirect:**
```typescript
{ path: '', redirectTo: '/courses', pathMatch: 'full' }
```
- Redirects root URL to /courses
- `pathMatch: 'full'` means exact match

2. **Route Parameters:**
```typescript
{ path: 'courses/view/:id', component: CourseDetailComponent }
```
- `:id` is a dynamic parameter
- Access via `ActivatedRoute`

3. **Wildcard Route:**
```typescript
{ path: '**', redirectTo: '/courses' }
```
- Catches all undefined routes (404 handler)
- Must be LAST in routes array

---

### 5.2 Router Setup - main.ts

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),      // ✅ Router configuration
    provideHttpClient(),         // ✅ HTTP client
    provideAnimations()          // ✅ Angular animations
  ]
})
```

**Standalone Component Bootstrap:**
- No `AppModule` needed
- Providers configured directly
- More modern approach (Angular 14+)

---

### 5.3 Navigation Methods

#### 1. Template Navigation - `routerLink`
```html
<!-- Declarative navigation -->
<button mat-button routerLink="/courses">Courses</button>
<button mat-button [routerLink]="['/courses/view', course.id]">View</button>

<!-- Active link styling -->
<button routerLink="/courses" routerLinkActive="active">Courses</button>
```

#### 2. Programmatic Navigation - Router
```typescript
export class CourseFormComponent {
  constructor(private router: Router) {}

  onCancel(): void {
    this.router.navigate(['/courses']);
  }

  editCourse(id: string): void {
    this.router.navigate(['/courses/edit', id]);
  }
}
```

#### 3. Getting Route Parameters
```typescript
export class CourseDetailComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Snapshot - for one-time read
    const id = this.route.snapshot.paramMap.get('id');
    
    // OR Observable - for reactive updates
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
    });
  }
}
```

---

### 5.4 Router Outlet

```html
<!-- app.component.html -->
<div class="navigation">
  <mat-toolbar>
    <button mat-button routerLink="/courses">Courses</button>
  </mat-toolbar>
</div>

<div class="container">
  <router-outlet></router-outlet>  <!-- Components render here -->
</div>
```

**How it works:**
1. User clicks link or URL changes
2. Router matches URL to route
3. Router loads component
4. Component renders inside `<router-outlet>`

---

## 6. Forms and Validation

### 6.1 Reactive Forms (Your Approach)

**What are Reactive Forms?**
Form controls created and managed in the component class, not template.

**Template-Driven vs Reactive:**

| Template-Driven | Reactive (YOU) |
|----------------|----------------|
| `[(ngModel)]` | `FormGroup`, `FormControl` |
| Logic in template | Logic in component |
| Async | Synchronous |
| Less testable | Highly testable |
| Simple forms | Complex forms ✅ |

---

### 6.2 Building a Form - CourseFormComponent

#### Step 1: Import FormBuilder
```typescript
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
```

#### Step 2: Create FormGroup
```typescript
export class CourseFormComponent {
  courseForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
}
```

**FormGroup Structure:**
```typescript
this.fb.group({
  fieldName: [
    'initialValue',           // Default value
    [Validators.required]     // Validators array (sync)
    // [asyncValidator]       // Async validators (optional)
  ]
})
```

---

### 6.3 Form Validation

**Built-in Validators:**
```typescript
Validators.required           // Field must have value
Validators.minLength(3)       // Minimum length
Validators.maxLength(100)     // Maximum length
Validators.pattern(/regex/)   // Regex pattern
Validators.email              // Valid email
Validators.min(18)            // Minimum number
Validators.max(100)           // Maximum number
```

**Your Validation Implementation:**
```html
<mat-form-field>
  <mat-label>Course Name</mat-label>
  <input matInput formControlName="name">
  
  <!-- Show errors conditionally -->
  <mat-error *ngIf="courseForm.get('name')?.hasError('required')">
    Course name is required
  </mat-error>
  <mat-error *ngIf="courseForm.get('name')?.hasError('minlength')">
    Course name must be at least 3 characters
  </mat-error>
</mat-form-field>
```

---

### 6.4 Form Submission

```typescript
onSubmit(): void {
  // Check form validity
  if (this.courseForm.valid && !this.isSubmitting) {
    this.isSubmitting = true;
    
    // Get form values
    const formValue = this.courseForm.value;
    
    // Create data object
    const courseData: Course = {
      name: formValue.name,
      description: formValue.description,
      // ... other fields
    };

    // Call service
    if (this.isEditMode) {
      this.updateCourse(courseData);
    } else {
      this.createCourse(courseData);
    }
  }
}
```

**Form State Properties:**
```typescript
courseForm.valid      // true if all validators pass
courseForm.invalid    // opposite of valid
courseForm.pristine   // true if user hasn't changed anything
courseForm.dirty      // true if user changed value
courseForm.touched    // true if user focused on field
courseForm.untouched  // opposite of touched
```

---

### 6.5 Patching Form Values (Edit Mode)

```typescript
loadCourseForEdit(): void {
  this.courseService.getCourseById(this.courseId).subscribe({
    next: (course) => {
      // Patch form with existing values
      this.courseForm.patchValue({
        name: course.name,
        description: course.description,
        board: course.board,
        medium: course.medium,
        grade: course.grade,
        subject: course.subject
      });
    }
  });
}
```

**patchValue vs setValue:**
- `patchValue()` - Updates only specified fields
- `setValue()` - Updates ALL fields (must provide all)

---

## 7. HTTP Communication

### 7.1 HttpClient Service

**Setup (main.ts):**
```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()  // ✅ Enables HTTP
  ]
})
```

**Injection:**
```typescript
constructor(private http: HttpClient) { }
```

---

### 7.2 HTTP Methods

#### GET Request
```typescript
getAllCourses(): Observable<Course[]> {
  return this.http.get<PaginatedResponse<Course>>(`${this.baseUrl}/courses/get`)
    .pipe(
      map(response => response.content || [])
    );
}
```

#### POST Request
```typescript
createCourse(course: Course): Observable<Course> {
  return this.http.post<ApiEnvelope<Course>>(
    `${this.baseUrl}/courses/add`,
    course  // Request body
  ).pipe(
    map(response => response.result.data)
  );
}
```

#### PUT Request
```typescript
updateCourse(id: string, course: Course): Observable<Course> {
  return this.http.put<ApiEnvelope<Course>>(
    `${this.baseUrl}/courses/update/${id}`,
    course
  ).pipe(
    map(response => response.result.data)
  );
}
```

#### DELETE Request
```typescript
deleteCourse(id: string): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/courses/delete/${id}`);
}
```

---

### 7.3 Response Transformation with `pipe()` and `map()`

**Why Transform?**
Backend response structure might not match frontend needs.

**Your Backend Response:**
```json
{
  "id": "api.course.get",
  "ver": "v1",
  "ts": "2025-10-26T15:56:49.138549Z",
  "responseCode": "OK",
  "result": {
    "message": "Course fetched successfully",
    "data": {
      "id": "5d40256e...",
      "name": "React",
      "description": "JS library"
    }
  }
}
```

**Your Transformation:**
```typescript
getCourseById(id: string): Observable<Course> {
  return this.http.get<ApiEnvelope<Course>>(`${this.baseUrl}/courses/get/${id}`)
    .pipe(
      map(response => response.result.data)  // Extract only data
    );
}
```

**Result:** Components receive just the `Course` object, not the wrapper!

---

### 7.4 Error Handling

```typescript
getCourseById(id: string): Observable<Course> {
  return this.http.get<ApiEnvelope<Course>>(`${this.baseUrl}/courses/get/${id}`)
    .pipe(
      map(response => response.result.data),
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        return throwError(() => error);
      })
    );
}
```

**In Component:**
```typescript
this.courseService.getCourseById(id).subscribe({
  next: (course) => {
    this.course = course;  // Success handler
  },
  error: (error) => {
    console.error('Error:', error);  // Error handler
    this.snackBar.open('Error loading course', 'Close');
  }
});
```

---

### 7.5 Proxy Configuration

**Problem:** CORS errors when calling backend from frontend

**Your Solution (proxy.conf.json):**
```json
{
  "/api/*": {
    "target": "http://localhost:8089",
    "secure": false,
    "changeOrigin": true
  }
}
```

**How it works:**
1. Frontend makes request to: `http://localhost:4800/api/courses`
2. Proxy intercepts and forwards to: `http://localhost:8089/api/courses`
3. Backend responds to proxy
4. Proxy returns response to frontend

**Result:** No CORS issues during development!

---

## 8. RxJS and Observables

### 8.1 What is RxJS?

**RxJS (Reactive Extensions for JavaScript):**
Library for reactive programming using Observables.

**Observable vs Promise:**

| Promise | Observable |
|---------|-----------|
| Single value | Multiple values (stream) |
| Eager | Lazy (only executes when subscribed) |
| Not cancellable | Cancellable |
| `.then()`, `.catch()` | `.subscribe()`, operators |

---

### 8.2 Observable Pattern

**Producer → Stream → Consumer**

```typescript
// PRODUCER (Service)
getCourses(): Observable<Course[]> {
  return this.http.get<Course[]>('/api/courses');
}

// CONSUMER (Component)
this.courseService.getCourses().subscribe({
  next: (courses) => {
    this.courses = courses;  // Handle data
  },
  error: (error) => {
    console.error(error);    // Handle error
  },
  complete: () => {
    console.log('Complete'); // Optional: when stream completes
  }
});
```

---

### 8.3 RxJS Operators Used in Your Project

#### `map()` - Transform Data
```typescript
getAllCourses(): Observable<Course[]> {
  return this.http.get<PaginatedResponse<Course>>(`${this.baseUrl}/courses/get`)
    .pipe(
      map(response => response.content || [])  // Extract content array
    );
}
```

#### `catchError()` - Handle Errors
```typescript
getCourseById(id: string): Observable<Course> {
  return this.http.get<ApiEnvelope<Course>>(`${this.baseUrl}/courses/get/${id}`)
    .pipe(
      map(response => response.result.data),
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        return throwError(() => error);
      })
    );
}
```

---

### 8.4 Subscription Management

**Problem:** Memory leaks if subscriptions aren't cleaned up

**Your Approach:**
```typescript
loadCourses(): void {
  this.courseService.getAllCourses().subscribe({
    next: (courses) => {
      this.courses = courses;
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
  // HTTP Observables auto-complete, so no cleanup needed
}
```

**For Long-lived Subscriptions (if you had them):**
```typescript
export class MyComponent implements OnDestroy {
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.someService.data$.subscribe(...)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();  // Clean up!
  }
}
```

---

## 9. Angular Material

### 9.1 What is Angular Material?

**Angular Material:** Official UI component library for Angular following Material Design.

**Your Material Modules:**
```typescript
imports: [
  MatCardModule,          // Cards
  MatButtonModule,        // Buttons
  MatFormFieldModule,     // Form fields
  MatInputModule,         // Input fields
  MatSelectModule,        // Dropdowns
  MatToolbarModule,       // Toolbar/Header
  MatIconModule,          // Material icons
  MatChipsModule,         // Chip/Tag elements
  MatSnackBarModule,      // Toast notifications
  MatDialogModule         // Modal dialogs
]
```

---

### 9.2 Material Components Used

#### 1. Mat Card
```html
<mat-card class="course-card">
  <mat-card-header>
    <mat-card-title>{{ course.name }}</mat-card-title>
    <mat-card-subtitle>{{ course.board }}</mat-card-subtitle>
  </mat-card-header>
  
  <mat-card-content>
    <p>{{ course.description }}</p>
  </mat-card-content>
  
  <mat-card-actions>
    <button mat-button>View</button>
  </mat-card-actions>
</mat-card>
```

#### 2. Mat Form Field
```html
<mat-form-field appearance="outline">
  <mat-label>Course Name</mat-label>
  <input matInput formControlName="name">
  <mat-icon matPrefix>book</mat-icon>
  <mat-error *ngIf="courseForm.get('name')?.invalid">
    Name is required
  </mat-error>
</mat-form-field>
```

**Appearances:**
- `outline` - Outlined style (modern, your choice)
- `fill` - Filled background
- `standard` - Underline only

#### 3. Mat Select (Dropdown)
```html
<mat-form-field>
  <mat-label>Board</mat-label>
  <mat-select formControlName="board">
    <mat-option value="CBSE">CBSE</mat-option>
    <mat-option value="State">State</mat-option>
  </mat-select>
</mat-form-field>

<!-- With ngFor -->
<mat-select [(ngModel)]="filters.board">
  <mat-option *ngFor="let board of boardOptions" [value]="board">
    {{ board }}
  </mat-option>
</mat-select>
```

#### 4. Mat Buttons
```html
<!-- Basic button -->
<button mat-button>Click</button>

<!-- Raised button (elevated) -->
<button mat-raised-button color="primary">Save</button>

<!-- Icon button -->
<button mat-icon-button>
  <mat-icon>delete</mat-icon>
</button>

<!-- Stroked button (outlined) -->
<button mat-stroked-button>Cancel</button>
```

**Colors:**
- `primary` - Your primary brand color
- `accent` - Accent color
- `warn` - Warning/error color (usually red)

#### 5. Mat Toolbar
```html
<mat-toolbar color="primary">
  <span>{{ title }}</span>
  <span class="spacer"></span>
  <button mat-button routerLink="/courses">Courses</button>
</mat-toolbar>
```

#### 6. Mat Icon
```html
<mat-icon>add</mat-icon>
<mat-icon>edit</mat-icon>
<mat-icon>delete</mat-icon>
```

**Icon Names:** From Material Icons library (https://fonts.google.com/icons)

---

### 9.3 Mat Dialog (Modal)

**Opening a Dialog:**
```typescript
export class CourseFormComponent {
  constructor(private dialog: MatDialog) {}

  openAddUnitDialog(): void {
    const dialogRef = this.dialog.open(AddUnitDialogComponent, {
      width: '500px',
      data: { courseId: this.courseId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog returned:', result);
        this.loadAvailableUnits();
      }
    });
  }
}
```

**Dialog Component:**
```typescript
@Component({
  selector: 'app-add-unit-dialog',
  template: `
    <h2 mat-dialog-title>Add New Unit</h2>
    <mat-dialog-content>
      <!-- Form content -->
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true">Add</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class AddUnitDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddUnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
```

---

### 9.4 Mat Snackbar (Notifications)

```typescript
export class CourseFormComponent {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(): void {
    this.snackBar.open('Course created successfully', 'Close', {
      duration: 3000,                  // 3 seconds
      horizontalPosition: 'right',     // left, center, right
      verticalPosition: 'top'          // top, bottom
    });
  }

  showError(): void {
    this.snackBar.open('Error occurred', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']  // Custom CSS class
    });
  }
}
```

---

## 10. Project Structure

### 10.1 Folder Organization

```
course-frontend/
├── src/
│   ├── app/
│   │   ├── components/              # UI Components
│   │   │   ├── course-list/         # List all courses
│   │   │   ├── course-detail/       # View single course
│   │   │   ├── course-form/         # Add/Edit course
│   │   │   ├── unit-form/           # Create unit
│   │   │   ├── confirm-dialog/      # Confirmation popup
│   │   │   └── add-unit-dialog/     # Add unit popup
│   │   ├── services/                # Business logic
│   │   │   ├── course.service.ts    # Course CRUD
│   │   │   └── unit.service.ts      # Unit CRUD
│   │   ├── models/                  # TypeScript interfaces
│   │   │   ├── course.model.ts      # Course & Filter interfaces
│   │   │   └── unit.model.ts        # Unit interface
│   │   ├── pipes/                   # Custom pipes
│   │   │   └── join-list.pipe.ts    # Array to string
│   │   ├── app-routing.module.ts    # Route configuration
│   │   ├── app.component.ts         # Root component
│   │   ├── app.component.html       # Root template
│   │   └── app.component.scss       # Root styles
│   ├── environments/                # Environment configs
│   │   ├── environment.ts           # Development
│   │   └── environment.prod.ts      # Production
│   ├── main.ts                      # App bootstrap
│   ├── styles.scss                  # Global styles
│   └── index.html                   # HTML shell
├── proxy.conf.json                  # Dev proxy config
├── angular.json                     # Angular CLI config
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript config
```

---

### 10.2 Component Structure (Example)

**Each component typically has 4 files:**

```
course-list/
├── course-list.component.ts         # Component logic
├── course-list.component.html       # Template (view)
├── course-list.component.scss       # Styles (scoped)
└── course-list.component.spec.ts    # Unit tests (optional)
```

---

## 11. Best Practices Used

### 11.1 Code Organization

✅ **Separation of Concerns**
- Components for UI
- Services for business logic
- Models for data structures

✅ **Single Responsibility**
- Each class has one job
- `CourseService` only handles courses
- `CourseListComponent` only displays list

✅ **DRY (Don't Repeat Yourself)**
- Reusable services
- Shared components (dialogs)
- Custom pipes

---

### 11.2 TypeScript Best Practices

✅ **Strong Typing**
```typescript
// Good ✅
course: Course | null = null;
courses: Course[] = [];

// Bad ❌
course: any;
```

✅ **Interface Usage**
```typescript
// Defines contract
export interface Course {
  id?: string;
  name: string;
}
```

✅ **Access Modifiers**
```typescript
export class CourseService {
  private baseUrl = environment.baseUrl;  // Private (internal)
  
  constructor(private http: HttpClient) {}  // Private injection
  
  public getAllCourses() {}  // Public (default)
}
```

---

### 11.3 Angular Best Practices

✅ **Lifecycle Hooks**
```typescript
// API calls in ngOnInit, not constructor
ngOnInit(): void {
  this.loadCourses();
}
```

✅ **Unsubscribe from Long-lived Observables**
```typescript
// HTTP observables auto-complete ✅
this.http.get().subscribe(...)

// Custom observables need cleanup
ngOnDestroy(): void {
  this.subscription.unsubscribe();
}
```

✅ **Reactive Forms for Complex Forms**
```typescript
// Better control, validation, testing
this.courseForm = this.fb.group({
  name: ['', Validators.required]
});
```

✅ **Standalone Components**
```typescript
// Modern approach, better tree-shaking
@Component({
  standalone: true,
  imports: [CommonModule, ...]
})
```

---

### 11.4 Performance Practices

✅ **trackBy in *ngFor**
```html
<!-- Improves rendering performance -->
<div *ngFor="let course of courses; trackBy: trackByCourseId">
```

```typescript
trackByCourseId(index: number, course: Course): string {
  return course.id!;
}
```

✅ **OnPush Change Detection** (not implemented, but good to know)
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

---

### 11.5 Security Practices

✅ **Environment Variables**
```typescript
// Don't hardcode URLs
export const environment = {
  production: false,
  baseUrl: 'http://localhost:8089/api'
};
```

✅ **HttpOnly Cookies** (backend responsibility)
✅ **CORS Configuration** (handled via proxy)

---

## 12. Data Flow Architecture

### Request Flow (Create Course Example)

```
1. USER ACTION
   ↓
   User clicks "Create Course" button
   ↓
2. COMPONENT (course-form.component.ts)
   ↓
   onSubmit() {
     const courseData: Course = {...};
     this.courseService.createCourse(courseData).subscribe(...)
   }
   ↓
3. SERVICE (course.service.ts)
   ↓
   createCourse(course: Course): Observable<Course> {
     return this.http.post(...)
   }
   ↓
4. HTTP CLIENT
   ↓
   Sends HTTP POST request to backend
   ↓
5. BACKEND (Spring Boot)
   ↓
   Processes request, saves to database
   ↓
6. HTTP RESPONSE
   ↓
   Returns response via Observable
   ↓
7. COMPONENT
   ↓
   subscribe({
     next: (result) => {
       // Show success message
       // Navigate to list
     }
   })
```

---

## 13. Common Patterns in Your Project

### 13.1 CRUD Operations Pattern

**Every entity follows the same pattern:**

```typescript
// 1. LIST
getAllCourses(): Observable<Course[]>
→ CourseListComponent displays in cards

// 2. VIEW
getCourseById(id): Observable<Course>
→ CourseDetailComponent shows details

// 3. CREATE
createCourse(course): Observable<Course>
→ CourseFormComponent (add mode)

// 4. UPDATE
updateCourse(id, course): Observable<Course>
→ CourseFormComponent (edit mode)

// 5. DELETE
deleteCourse(id): Observable<void>
→ ConfirmDialog → Delete
```

---

### 13.2 Loading State Pattern

```typescript
export class CourseDetailComponent {
  course: Course | null = null;
  loading = true;   // Start as loading
  error = false;

  loadCourse(id: string): void {
    this.loading = true;
    this.error = false;
    
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
```

**Template:**
```html
<div *ngIf="loading">Loading...</div>
<div *ngIf="error">Error occurred</div>
<div *ngIf="!loading && !error && course">
  <!-- Display course -->
</div>
```

---

### 13.3 Form Mode Pattern (Add/Edit)

```typescript
export class CourseFormComponent {
  courseForm: FormGroup;
  isEditMode = false;
  courseId: string | null = null;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;  // Convert to boolean
    
    if (this.isEditMode) {
      this.loadCourseForEdit();
    }
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Course' : 'Add Course';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Update' : 'Create';
  }
}
```

---

## 14. Key Takeaways

### Angular Fundamentals
1. **Components** - Building blocks of UI
2. **Services** - Shared business logic
3. **Dependency Injection** - Loose coupling
4. **Routing** - Navigation between views
5. **Forms** - User input handling
6. **HTTP** - Server communication
7. **Observables** - Async data streams

### Your Project Architecture
1. **Standalone Components** (modern approach)
2. **Reactive Forms** (complex forms)
3. **Service-based** (centralized logic)
4. **Material Design** (consistent UI)
5. **RESTful API** (backend communication)

### Development Workflow
```
1. ng serve → Start dev server
2. Edit code → Auto-reload
3. ng build → Production build
4. Deploy → dist/ folder
```

---

## 15. Learning Path

### Beginner (You are here!)
- ✅ Components and templates
- ✅ Services and DI
- ✅ Routing
- ✅ Forms
- ✅ HTTP Client
- ✅ Material UI

### Intermediate
- State management (NgRx, Signals)
- Advanced RxJS operators
- Custom directives
- Guards and resolvers
- Lazy loading
- Testing (Jasmine, Karma)

### Advanced
- Change detection strategies
- Server-side rendering (SSR)
- Micro-frontends
- Performance optimization
- PWA (Progressive Web Apps)

---

## 16. Common Interview Questions

### Q1: What is the difference between constructor and ngOnInit?
**Answer:**
- `constructor()` - Dependency injection only
- `ngOnInit()` - Component initialization, API calls, input properties available

### Q2: What is the difference between Observable and Promise?
**Answer:**
- Observable: Stream, lazy, cancellable, multiple values
- Promise: Single value, eager, not cancellable

### Q3: What is Dependency Injection?
**Answer:**
Design pattern where a class receives its dependencies from external sources (Angular injector) rather than creating them itself.

### Q4: What are lifecycle hooks?
**Answer:**
Methods called by Angular at specific moments in a component's life: ngOnInit, ngOnChanges, ngOnDestroy, etc.

### Q5: What is the purpose of services?
**Answer:**
Services provide shared functionality across components, like API calls, data management, business logic.

### Q6: Template-driven vs Reactive forms?
**Answer:**
- Template-driven: Logic in template, `[(ngModel)]`, simple forms
- Reactive: Logic in component, `FormGroup`, complex forms, better testing

### Q7: What is RxJS?
**Answer:**
Library for reactive programming using Observables to handle asynchronous operations and event streams.

---

## 17. Useful Commands

```bash
# Development
ng serve                          # Start dev server
ng serve --port 4800             # Custom port
ng serve --open                  # Open browser

# Build
ng build                         # Development build
ng build --configuration production  # Production build

# Generate
ng generate component name       # Create component
ng generate service name         # Create service
ng g c name --standalone        # Standalone component

# Testing
ng test                         # Run unit tests
ng e2e                          # Run e2e tests

# Dependencies
npm install                     # Install packages
npm install package-name        # Add package
npm update                      # Update packages
```

---

## 18. Resources for Further Learning

### Official Documentation
- Angular Docs: https://angular.io/docs
- Angular Material: https://material.angular.io
- RxJS: https://rxjs.dev

### Video Tutorials
- Angular University
- Academind (Maximilian Schwarzmüller)
- Fireship.io

### Practice
- Build a Todo App
- Build a Blog
- Build an E-commerce site

---

## Conclusion

Your **Course Management System** demonstrates solid understanding of:
- ✅ Modern Angular (v17 with Standalone Components)
- ✅ Reactive Forms
- ✅ HTTP communication
- ✅ Routing and Navigation
- ✅ Material Design
- ✅ TypeScript interfaces
- ✅ Service architecture
- ✅ Observable patterns

**Next Steps:**
1. Add authentication (JWT tokens)
2. Implement state management (NgRx/Signals)
3. Add unit tests
4. Optimize performance
5. Deploy to production

---

**Keep learning and building! 🚀**

