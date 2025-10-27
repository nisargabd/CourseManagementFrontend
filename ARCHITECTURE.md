# 🏗️ Angular Course Management System - Architecture

## Visual Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    APP COMPONENT (Root)                     │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │           Navigation Toolbar (Material)              │  │ │
│  │  │  [Courses] [Create Unit]                            │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              <router-outlet>                         │  │ │
│  │  │   (Components render here based on route)            │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ROUTING                                  │
│                                                                   │
│  /courses              → CourseListComponent                     │
│  /courses/view/:id     → CourseDetailComponent                   │
│  /courses/edit/:id     → CourseFormComponent                     │
│  /courses/add          → CourseFormComponent                     │
│  /createUnit           → UnitFormComponent                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       COMPONENTS                                 │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │ CourseList      │  │ CourseDetail    │  │ CourseForm     │  │
│  │                 │  │                 │  │                │  │
│  │ • Display cards │  │ • Show details  │  │ • Add/Edit     │  │
│  │ • Search        │  │ • Units table   │  │ • Validation   │  │
│  │ • Filter        │  │ • Edit/Delete   │  │ • Unit select  │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬───────┘  │
│           │                    │                     │           │
│           └────────────────────┼─────────────────────┘           │
│                                │                                 │
└────────────────────────────────┼─────────────────────────────────┘
                                 │
                                 ▼ (Dependency Injection)
┌─────────────────────────────────────────────────────────────────┐
│                         SERVICES                                 │
│                                                                   │
│  ┌─────────────────────────────┐  ┌──────────────────────────┐  │
│  │    CourseService            │  │     UnitService          │  │
│  │                             │  │                          │  │
│  │ • getAllCourses()           │  │ • getAllUnits()          │  │
│  │ • getCourseById(id)         │  │ • getUnitById(id)        │  │
│  │ • createCourse(course)      │  │ • createUnit(unit)       │  │
│  │ • updateCourse(id, course)  │  │ • updateUnit(id, unit)   │  │
│  │ • deleteCourse(id)          │  │ • deleteUnit(id)         │  │
│  └──────────────┬──────────────┘  └──────────┬───────────────┘  │
│                 │                            │                   │
└─────────────────┼────────────────────────────┼───────────────────┘
                  │                            │
                  └────────────┬───────────────┘
                               │ (HttpClient)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HTTP CLIENT                                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Request Transformation (RxJS Operators)                   │ │
│  │  • pipe()                                                  │ │
│  │  • map() - Extract data from response                     │ │
│  │  • catchError() - Handle errors                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROXY (Development)                           │
│                                                                   │
│  localhost:4800/api/* → localhost:8089/api/*                     │
│  (Solves CORS issues)                                            │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SPRING BOOT BACKEND                             │
│                                                                   │
│  /api/courses/get           → Get all courses (paginated)        │
│  /api/courses/get/{id}      → Get course by ID                   │
│  /api/courses/add           → Create course                      │
│  /api/courses/update/{id}   → Update course                      │
│  /api/courses/delete/{id}   → Delete course                      │
│  /api/units/get             → Get all units                      │
│  /api/units/add             → Create unit                        │
│  /api/units/update/{id}     → Update unit                        │
│  /api/units/delete/{id}     → Delete unit                        │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### Scenario: User Views Course Details

```
1. USER ACTION
   │
   ├─→ User clicks "View Details" on course card
   │
2. NAVIGATION
   │
   ├─→ routerLink="/courses/view/{{courseId}}"
   │
3. ROUTER
   │
   ├─→ Matches route: { path: 'courses/view/:id', component: CourseDetailComponent }
   │
4. COURSE DETAIL COMPONENT
   │
   ├─→ ngOnInit() called
   ├─→ Extract courseId from route
   ├─→ Call: this.courseService.getCourseById(courseId)
   │
5. COURSE SERVICE
   │
   ├─→ getCourseById(id: string): Observable<Course>
   ├─→ HTTP GET request to: /api/courses/get/{id}
   │
6. HTTP CLIENT
   │
   ├─→ Sends request through proxy
   ├─→ Proxy forwards to: http://localhost:8089/api/courses/get/{id}
   │
7. BACKEND
   │
   ├─→ CourseController receives request
   ├─→ CourseService fetches from database
   ├─→ Returns response with ApiEnvelope structure
   │
8. RESPONSE TRANSFORMATION
   │
   ├─→ pipe(map(response => response.result.data))
   ├─→ Extracts Course object from envelope
   │
9. OBSERVABLE SUBSCRIPTION
   │
   ├─→ Component receives Course object
   ├─→ Updates: this.course = course
   ├─→ Template re-renders with course data
   │
10. UI UPDATE
    │
    └─→ Course details displayed
        - Name, description
        - Board, medium, grade, subject
        - Units table
```

## Data Models

```typescript
┌─────────────────────────────────────────────────────┐
│                   Course Model                      │
├─────────────────────────────────────────────────────┤
│ id?: string                                         │
│ name: string                                        │
│ description: string                                 │
│ board: string                                       │
│ medium: string[]                                    │
│ grade: string[]                                     │
│ subject: string[]                                   │
│ units?: Unit[]                                      │
└───────────────────┬─────────────────────────────────┘
                    │ has many
                    ▼
┌─────────────────────────────────────────────────────┐
│                    Unit Model                       │
├─────────────────────────────────────────────────────┤
│ id?: string                                         │
│ title: string                                       │
│ content: string                                     │
│ courseId?: string                                   │
└─────────────────────────────────────────────────────┘
```

## State Management (Implicit)

```
┌────────────────────────────────────────────────────────────┐
│                    Component State                          │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  Each component manages its own state:                      │
│                                                              │
│  CourseListComponent:                                       │
│    • courses: Course[] = []                                 │
│    • filteredCourses: Course[] = []                         │
│    • searchTerm: string = ''                                │
│    • filters: CourseFilter = {}                             │
│                                                              │
│  CourseDetailComponent:                                     │
│    • course: Course | null = null                           │
│    • loading: boolean = true                                │
│    • error: boolean = false                                 │
│                                                              │
│  CourseFormComponent:                                       │
│    • courseForm: FormGroup                                  │
│    • isEditMode: boolean = false                            │
│    • isSubmitting: boolean = false                          │
│    • availableUnits: Unit[] = []                            │
│    • selectedUnits: string[] = []                           │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Module Dependencies

```
┌────────────────────────────────────────────────────────────┐
│                  Angular Core Modules                       │
├────────────────────────────────────────────────────────────┤
│ @angular/core          → Component, Injectable, OnInit     │
│ @angular/common        → CommonModule, ngIf, ngFor         │
│ @angular/forms         → ReactiveFormsModule, Validators   │
│ @angular/router        → Router, ActivatedRoute            │
│ @angular/animations    → Material animations               │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│               Angular Material Modules                      │
├────────────────────────────────────────────────────────────┤
│ @angular/material/card        → mat-card                   │
│ @angular/material/button      → mat-button                 │
│ @angular/material/form-field  → mat-form-field             │
│ @angular/material/input       → matInput                   │
│ @angular/material/select      → mat-select                 │
│ @angular/material/toolbar     → mat-toolbar                │
│ @angular/material/icon        → mat-icon                   │
│ @angular/material/dialog      → mat-dialog                 │
│ @angular/material/snack-bar   → MatSnackBar                │
│ @angular/material/chips       → mat-chip                   │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                   External Libraries                        │
├────────────────────────────────────────────────────────────┤
│ rxjs                  → Observable, pipe, map, catchError  │
│ typescript            → Type system                        │
│ zone.js               → Change detection                   │
└────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CORS (Cross-Origin Resource Sharing)                    │
│     ├─ Development: Handled by proxy.conf.json             │
│     └─ Production: Backend CORS configuration               │
│                                                              │
│  2. Environment Variables                                   │
│     ├─ API URLs not hardcoded                              │
│     └─ Different configs for dev/prod                      │
│                                                              │
│  3. TypeScript Type Safety                                  │
│     ├─ Compile-time error checking                         │
│     └─ Prevents runtime errors                             │
│                                                              │
│  4. Form Validation                                         │
│     ├─ Client-side validation                              │
│     ├─ Prevents invalid data submission                    │
│     └─ Backend should also validate                        │
│                                                              │
│  5. HTTP Security (Backend)                                 │
│     ├─ HTTPS in production                                 │
│     ├─ JWT tokens (if implemented)                         │
│     └─ Input sanitization                                  │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Build & Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                   Development                                │
├─────────────────────────────────────────────────────────────┤
│  ng serve --port 4800                                        │
│  ├─ Compiles TypeScript to JavaScript                       │
│  ├─ Bundles modules                                          │
│  ├─ Starts webpack dev server                               │
│  ├─ Enables hot module replacement                          │
│  └─ Serves at http://localhost:4800                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Production Build                          │
├─────────────────────────────────────────────────────────────┤
│  ng build --configuration production                         │
│  ├─ Ahead-of-Time (AOT) compilation                         │
│  ├─ Tree shaking (removes unused code)                      │
│  ├─ Minification                                             │
│  ├─ Uglification                                             │
│  ├─ Optimization                                             │
│  └─ Output to dist/ folder                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Deployment                               │
├─────────────────────────────────────────────────────────────┤
│  Deploy dist/ folder to:                                     │
│  ├─ Nginx                                                    │
│  ├─ Apache                                                   │
│  ├─ Firebase Hosting                                         │
│  ├─ Netlify                                                  │
│  ├─ Vercel                                                   │
│  └─ AWS S3 + CloudFront                                     │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization Strategies

```
┌─────────────────────────────────────────────────────────────┐
│              Current Implementation                          │
├─────────────────────────────────────────────────────────────┤
│ ✅ Lazy loading (via routing)                               │
│ ✅ Standalone components (better tree-shaking)              │
│ ✅ Production build optimizations                           │
│ ✅ Material UI (optimized components)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            Future Optimizations (Optional)                   │
├─────────────────────────────────────────────────────────────┤
│ • OnPush change detection strategy                          │
│ • Virtual scrolling for large lists                         │
│ • trackBy functions in *ngFor                               │
│ • Service Worker (PWA)                                      │
│ • Preloading strategies                                     │
│ • Image lazy loading                                        │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Handling                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HTTP Error                                                  │
│     │                                                        │
│     ├─→ catchError in service                               │
│     │   ├─ Log error                                        │
│     │   └─ Return throwError()                              │
│     │                                                        │
│     └─→ Component subscribe error handler                   │
│         ├─ Update error state                               │
│         ├─ Show MatSnackBar notification                    │
│         └─ Display error UI                                 │
│                                                              │
│  Form Validation Error                                      │
│     │                                                        │
│     ├─→ Validators in FormGroup                             │
│     │                                                        │
│     └─→ mat-error in template                               │
│         └─ Display error message                            │
│                                                              │
│  Route Not Found                                            │
│     │                                                        │
│     └─→ Wildcard route                                      │
│         └─ Redirect to /courses                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Testing Architecture (If Implemented)

```
┌─────────────────────────────────────────────────────────────┐
│                   Testing Pyramid                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌─────────────┐                          │
│                    │   E2E Tests │  (Fewest)                │
│                    │  (Cypress)  │                          │
│                    └─────────────┘                          │
│                 ┌────────────────────┐                      │
│                 │  Integration Tests │                      │
│                 │  (Component+Service)│                     │
│                 └────────────────────┘                      │
│            ┌──────────────────────────────┐                │
│            │       Unit Tests              │  (Most)        │
│            │  (Jasmine + Karma)            │                │
│            │  • Service tests              │                │
│            │  • Component tests            │                │
│            │  • Pipe tests                 │                │
│            └──────────────────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## File Size & Bundle Analysis

```
Production Build Output:
┌────────────────────────────────────────────────────────────┐
│  main.js                    → 742 KB (152 KB gzipped)      │
│  styles.css                 → 85 KB (8 KB gzipped)         │
│  polyfills.js               → 34 KB (11 KB gzipped)        │
│  runtime.js                 → 908 bytes                    │
│  ───────────────────────────────────────────────────────   │
│  Total Initial Bundle       → 862 KB (172 KB gzipped)      │
└────────────────────────────────────────────────────────────┘

Optimization Tips:
• Consider lazy loading more routes
• Use lighter UI components if needed
• Implement code splitting
• Remove unused imports
```

---

## Key Architectural Decisions

### 1. Standalone Components
**Decision:** Use standalone components instead of NgModules  
**Rationale:**
- Simpler code structure
- Better tree-shaking
- Easier lazy loading
- Modern Angular best practice

### 2. Reactive Forms
**Decision:** Use Reactive Forms over Template-driven  
**Rationale:**
- Better for complex forms
- More testable
- Synchronous
- Better type safety

### 3. Service Layer
**Decision:** Centralize business logic in services  
**Rationale:**
- Reusability across components
- Easier to test
- Single source of truth
- Separation of concerns

### 4. Material Design
**Decision:** Use Angular Material for UI  
**Rationale:**
- Consistent design system
- Responsive components
- Accessibility built-in
- Well-maintained

### 5. Environment Configuration
**Decision:** Use environment files for config  
**Rationale:**
- Different settings for dev/prod
- Security (no hardcoded URLs)
- Easy deployment

---

## Comparison: Before vs After Fixes

### Before (Issues)
```
❌ API endpoint mismatches
❌ Response parsing errors
❌ Missing HTML templates
❌ Detached entity errors
❌ Units not displayed properly
```

### After (Fixed)
```
✅ All endpoints match backend
✅ Response parsed correctly (result.data)
✅ Complete HTML templates
✅ Proper unit association flow
✅ Units displayed in formatted table
```

---

This architecture document provides a visual understanding of how all the pieces fit together!


