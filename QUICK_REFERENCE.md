# 🚀 Angular Quick Reference Guide

## Common Tasks & Solutions

### Creating a New Component

```bash
# Generate standalone component
ng generate component components/my-component --standalone

# Short form
ng g c components/my-component --standalone
```

**Manual Creation:**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Hello</h1>`,
  styles: [`h1 { color: blue; }`]
})
export class MyComponent { }
```

---

### Creating a Service

```bash
ng generate service services/my-service

# Short form
ng g s services/my-service
```

**Template:**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get('url');
  }
}
```

---

### Routing

**Add Route:**
```typescript
// app-routing.module.ts
export const routes: Routes = [
  { path: 'my-path', component: MyComponent }
];
```

**Navigate in Template:**
```html
<!-- Static route -->
<a routerLink="/my-path">Link</a>

<!-- Dynamic route -->
<a [routerLink]="['/detail', itemId]">Link</a>

<!-- With query params -->
<a [routerLink]="['/search']" [queryParams]="{q: 'angular'}">Search</a>
```

**Navigate in Component:**
```typescript
constructor(private router: Router) {}

goToPage() {
  this.router.navigate(['/my-path']);
  
  // With params
  this.router.navigate(['/detail', id]);
  
  // With query params
  this.router.navigate(['/search'], { queryParams: { q: 'angular' } });
}
```

**Get Route Parameters:**
```typescript
constructor(private route: ActivatedRoute) {}

ngOnInit() {
  // Snapshot (one-time read)
  const id = this.route.snapshot.paramMap.get('id');
  
  // Observable (reactive)
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
  });
}
```

---

### HTTP Requests

**GET:**
```typescript
this.http.get<Type>('url').subscribe({
  next: (data) => console.log(data),
  error: (error) => console.error(error)
});
```

**POST:**
```typescript
this.http.post<Type>('url', body).subscribe({
  next: (response) => console.log(response),
  error: (error) => console.error(error)
});
```

**PUT:**
```typescript
this.http.put<Type>('url', body).subscribe({
  next: (response) => console.log(response)
});
```

**DELETE:**
```typescript
this.http.delete('url').subscribe({
  next: () => console.log('Deleted')
});
```

---

### Reactive Forms

**Setup:**
```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class MyComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: [18, [Validators.min(18), Validators.max(100)]]
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      const data = this.myForm.value;
      // Submit data
    }
  }
}
```

**Template:**
```html
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <input formControlName="name">
  
  <div *ngIf="myForm.get('name')?.invalid && myForm.get('name')?.touched">
    <span *ngIf="myForm.get('name')?.hasError('required')">
      Name is required
    </span>
    <span *ngIf="myForm.get('name')?.hasError('minlength')">
      Name must be at least 3 characters
    </span>
  </div>

  <button type="submit" [disabled]="myForm.invalid">Submit</button>
</form>
```

---

### Template Syntax Cheat Sheet

**Interpolation:**
```html
<h1>{{ title }}</h1>
<p>{{ user.name }}</p>
```

**Property Binding:**
```html
<img [src]="imageUrl">
<button [disabled]="isDisabled">
<div [class.active]="isActive">
<div [style.color]="myColor">
```

**Event Binding:**
```html
<button (click)="onClick()">
<input (keyup)="onKeyUp($event)">
<input (blur)="onBlur()">
```

**Two-Way Binding:**
```html
<input [(ngModel)]="name">
```

**Structural Directives:**
```html
<!-- ngIf -->
<div *ngIf="condition">Show when true</div>
<div *ngIf="condition; else elseBlock">If</div>
<ng-template #elseBlock>Else</ng-template>

<!-- ngFor -->
<div *ngFor="let item of items">{{ item }}</div>
<div *ngFor="let item of items; let i = index">{{ i }}: {{ item }}</div>

<!-- ngSwitch -->
<div [ngSwitch]="value">
  <p *ngSwitchCase="1">One</p>
  <p *ngSwitchCase="2">Two</p>
  <p *ngSwitchDefault>Other</p>
</div>
```

---

### RxJS Operators

**map - Transform data:**
```typescript
this.http.get(url).pipe(
  map(response => response.data)
)
```

**filter - Filter values:**
```typescript
source$.pipe(
  filter(x => x > 5)
)
```

**catchError - Handle errors:**
```typescript
this.http.get(url).pipe(
  catchError(error => {
    console.error(error);
    return throwError(() => error);
  })
)
```

**tap - Side effects (debugging):**
```typescript
this.http.get(url).pipe(
  tap(data => console.log('Data:', data))
)
```

**switchMap - Switch to new Observable:**
```typescript
this.searchTerm$.pipe(
  switchMap(term => this.api.search(term))
)
```

**debounceTime - Delay emissions:**
```typescript
input$.pipe(
  debounceTime(300) // Wait 300ms after last input
)
```

---

### Material Dialog

**Open Dialog:**
```typescript
constructor(private dialog: MatDialog) {}

openDialog() {
  const dialogRef = this.dialog.open(MyDialogComponent, {
    width: '500px',
    data: { name: 'John' }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog result:', result);
  });
}
```

**Dialog Component:**
```typescript
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  template: `
    <h2 mat-dialog-title>{{ data.name }}</h2>
    <mat-dialog-content>Content</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true">OK</button>
    </mat-dialog-actions>
  `
})
export class MyDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MyDialogComponent>
  ) {}
}
```

---

### Material Snackbar

```typescript
constructor(private snackBar: MatSnackBar) {}

showMessage() {
  this.snackBar.open('Message', 'Close', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  });
}
```

---

### Pipes

**Built-in Pipes:**
```html
<!-- Date -->
{{ date | date:'short' }}
{{ date | date:'dd/MM/yyyy' }}

<!-- Currency -->
{{ amount | currency:'USD' }}

<!-- Uppercase/Lowercase -->
{{ text | uppercase }}
{{ text | lowercase }}

<!-- JSON (debugging) -->
{{ object | json }}

<!-- Async (for Observables) -->
{{ observable$ | async }}
```

**Custom Pipe:**
```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myPipe',
  standalone: true
})
export class MyPipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    return value.toUpperCase();
  }
}

// Usage: {{ text | myPipe }}
```

---

### Environment Variables

**environment.ts (Development):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8089/api',
  apiKey: 'dev-key'
};
```

**environment.prod.ts (Production):**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com',
  apiKey: 'prod-key'
};
```

**Usage:**
```typescript
import { environment } from '../environments/environment';

constructor() {
  console.log(environment.apiUrl);
}
```

---

### Lifecycle Hooks Order

```typescript
1. constructor()
2. ngOnChanges()      // When input properties change
3. ngOnInit()         // ✅ Initialize component (API calls here)
4. ngDoCheck()
5. ngAfterContentInit()
6. ngAfterContentChecked()
7. ngAfterViewInit()
8. ngAfterViewChecked()
9. ngOnDestroy()      // ✅ Cleanup (unsubscribe here)
```

**Common Usage:**
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  ngOnInit() {
    // Initialize component
    this.loadData();
  }

  ngOnDestroy() {
    // Cleanup
    this.subscription?.unsubscribe();
  }
}
```

---

### Common Debugging Tips

**1. Check Console:**
```typescript
console.log('Value:', value);
console.error('Error:', error);
console.table(array);
```

**2. JSON Pipe in Template:**
```html
<pre>{{ object | json }}</pre>
```

**3. Tap Operator:**
```typescript
this.http.get(url).pipe(
  tap(data => console.log('API Response:', data))
)
```

**4. Check Network Tab:**
- Open DevTools (F12)
- Network tab
- Check request/response

**5. Angular DevTools Extension:**
- Chrome/Edge extension
- Component tree
- Profiler
- Dependency injection tree

---

### Common Errors & Solutions

**Error: Can't bind to 'ngModel'**
```typescript
// Solution: Import FormsModule
imports: [FormsModule]
```

**Error: Can't bind to 'formGroup'**
```typescript
// Solution: Import ReactiveFormsModule
imports: [ReactiveFormsModule]
```

**Error: No provider for HttpClient**
```typescript
// Solution: Add in main.ts
providers: [provideHttpClient()]
```

**Error: No provider for MatDialog**
```typescript
// Solution: Import MatDialogModule
imports: [MatDialogModule]
```

**Error: CORS Error**
```json
// Solution: Use proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:8089",
    "secure": false,
    "changeOrigin": true
  }
}
```

---

### VS Code Extensions

Essential:
- Angular Language Service
- Angular Snippets
- Prettier
- ESLint
- Material Icon Theme

Helpful:
- Auto Import
- Path Intellisense
- Bracket Pair Colorizer
- GitLens

---

### Angular CLI Commands

```bash
# Create new project
ng new project-name

# Serve application
ng serve
ng serve --port 4800
ng serve --open  # Opens browser

# Generate components
ng g c component-name
ng g c component-name --standalone

# Generate service
ng g s service-name

# Generate module
ng g m module-name

# Generate pipe
ng g pipe pipe-name

# Generate directive
ng g directive directive-name

# Generate guard
ng g guard guard-name

# Build
ng build
ng build --configuration production

# Run tests
ng test

# Lint
ng lint

# Update Angular
ng update @angular/cli @angular/core
```

---

### TypeScript Tips

**Type Annotations:**
```typescript
let name: string = 'John';
let age: number = 25;
let isActive: boolean = true;
let items: string[] = ['a', 'b'];
let user: User = { name: 'John' };

// Union types
let value: string | number;

// Optional properties
interface User {
  id: string;
  name?: string;  // Optional
}

// Null/Undefined
let value: string | null = null;
```

**Type Guards:**
```typescript
if (typeof value === 'string') {
  // value is string here
}

if (value !== null) {
  // value is not null here
}
```

**Non-null Assertion:**
```typescript
// If you're sure value is not null
const name = user!.name;
```

**Optional Chaining:**
```typescript
const name = user?.profile?.name;
```

---

### Git Workflow

```bash
# Check status
git status

# Add changes
git add .
git add file.ts

# Commit
git commit -m "Message"

# Push
git push origin main

# Pull
git pull origin main

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main

# Merge
git merge feature-name

# View history
git log --oneline
```

---

### Performance Tips

**1. trackBy in *ngFor:**
```html
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>
```
```typescript
trackById(index: number, item: any): any {
  return item.id;
}
```

**2. OnPush Change Detection:**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**3. Lazy Loading:**
```typescript
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component')
    .then(m => m.AdminComponent)
}
```

**4. Unsubscribe:**
```typescript
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

---

### Testing Basics

**Component Test:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    expect(component.title).toBe('My App');
  });
});
```

**Service Test:**
```typescript
describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

---

## Your Project Specific

### Start Development Server
```bash
cd course-frontend
npm start
# Runs on http://localhost:4800
```

### Build for Production
```bash
npm run build
# Output in dist/ folder
```

### Project Structure
```
src/app/
├── components/     # UI components
├── services/       # API services
├── models/         # TypeScript interfaces
├── pipes/          # Custom pipes
└── app-routing.module.ts  # Routes
```

### Common Tasks in Your Project

**Add a new course:**
1. Navigate to `/courses/add`
2. Fill form
3. Select units (optional)
4. Submit

**Edit a course:**
1. Click "Edit" on course card
2. Modify fields
3. Update unit associations
4. Submit

**View course details:**
1. Click "View Details"
2. See course info
3. View units table

---

**Quick tip:** Press `Ctrl + Shift + P` in VS Code to open command palette!

