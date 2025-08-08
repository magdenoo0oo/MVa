# Student Management System - ASP.NET Core MVC with .NET 8

A comprehensive web application for managing departments and students built with ASP.NET Core MVC and .NET 8.

## 🚀 Features

### Infrastructure
- **ASP.NET Core MVC with .NET 8**
- **Entity Framework Core** with Code-First approach
- **Dependency Injection** for DbContext
- **SQL Server** database with connection string from appsettings.json
- **Bootstrap 5** for responsive UI design

### Authentication & Authorization
- **ASP.NET Core Identity** integration
- **Role-based authorization** (Admin and Student roles)
- **Custom registration** with role assignment
- **Protected routes** and UI elements based on roles
- **Custom Access Denied** page

### Department Management
- **Full CRUD operations** with role restrictions
- **Model validation** with data annotations
- **Remote validation** for unique department names
- **Pagination** and **AJAX search**
- **Sorting** by Name and ID
- **Cascade delete prevention** (departments with students cannot be deleted)

### Student Management
- **Full CRUD operations** with role restrictions
- **Image upload** functionality with file storage in wwwroot/images
- **Model validation** with comprehensive data annotations
- **Pagination** and **AJAX search**
- **Sorting** by Name and ID
- **Profile image display** in lists and detail views

### Custom Filters
- **Global Exception Filter** for friendly error handling
- **Maintenance Mode Filter** that activates during weekends
- **Custom error pages** with user-friendly messages

### UI/UX Features
- **Responsive Bootstrap design** with custom styling
- **Font Awesome icons** throughout the interface
- **Interactive elements** with hover effects
- **Loading indicators** and form validation feedback
- **Alert messages** with auto-dismiss functionality

## 🏗️ Project Structure

```
StudentManagement/
├── Controllers/
│   ├── AccountController.cs
│   ├── DepartmentsController.cs
│   ├── HomeController.cs
│   └── StudentsController.cs
├── Data/
│   ├── ApplicationDbContext.cs
│   └── SeedData.cs
├── Filters/
│   ├── GlobalExceptionFilter.cs
│   └── MaintenanceModeFilter.cs
├── Models/
│   ├── ViewModels/
│   ├── ApplicationUser.cs
│   ├── Department.cs
│   ├── Student.cs
│   ├── ErrorViewModel.cs
│   └── PaginatedList.cs
├── Views/
│   ├── Account/
│   ├── Departments/
│   ├── Home/
│   ├── Students/
│   └── Shared/
├── wwwroot/
│   ├── css/
│   ├── js/
│   └── images/
├── Program.cs
├── appsettings.json
└── StudentManagement.csproj
```

## 🔧 Setup Instructions

### Prerequisites
- .NET 8 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

### Installation Steps

1. **Clone or create the project**
   ```bash
   mkdir StudentManagement
   cd StudentManagement
   ```

2. **Restore packages**
   ```bash
   dotnet restore
   ```

3. **Update database connection string**
   Update the connection string in `appsettings.json` if needed:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=StudentManagement;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Create and update database**
   ```bash
   dotnet ef database update
   ```

5. **Run the application**
   ```bash
   dotnet run
   ```

## 👥 Default User Accounts

The application includes seeded user accounts for testing:

### Admin Account
- **Email:** admin@studentmanagement.com
- **Password:** Admin123!
- **Role:** Admin

### Student Account
- **Email:** student@studentmanagement.com
- **Password:** Student123!
- **Role:** Student

## 🔒 Authorization Rules

### Department Operations
- **View (Index/Details):** Everyone (including unauthenticated users)
- **Create/Edit/Delete:** Admin only
- **Menu visibility:** Admin only

### Student Operations
- **View (Index/Details):** Everyone (including unauthenticated users)
- **Create/Edit/Delete:** Admin and Student roles
- **Menu visibility:** Admin only

### Special Features
- **Image Upload:** Available in Create/Edit student forms
- **Cascade Delete Protection:** Departments with students cannot be deleted
- **Maintenance Mode:** Automatically activates on weekends

## 🛠️ Technical Features

### Model Validation
- Required field validation
- Range validation for GPA and Budget
- Email format validation
- Phone number validation
- Remote validation for unique department names

### Data Features
- **Pagination:** 5 departments per page, 10 students per page
- **AJAX Search:** Real-time search without page refresh
- **Sorting:** By Name (A-Z, Z-A) and ID (ascending, descending)
- **Image Upload:** Secure file handling with unique naming

### Error Handling
- Global exception filter with user-friendly messages
- Custom error pages for different scenarios
- Maintenance mode with configurable messages
- Validation error display with Bootstrap styling

## 🎨 UI Components

### Responsive Design
- Mobile-friendly navigation with collapsible menu
- Responsive tables with horizontal scrolling
- Card-based layout for better content organization
- Bootstrap grid system for consistent spacing

### Interactive Elements
- Hover effects on cards and buttons
- Loading spinners for form submissions
- Auto-hiding alert messages
- Confirmation dialogs for delete operations
- Image preview for file uploads

## 📝 Development Notes

### Code Organization
- Clean separation of concerns with MVC pattern
- Repository pattern implemented through Entity Framework
- Dependency injection for all services
- Consistent naming conventions and code structure

### Security Features
- CSRF protection on all forms
- Role-based authorization attributes
- Secure file upload with type validation
- SQL injection prevention through EF Core parameterized queries

### Performance Considerations
- Async/await pattern for database operations
- Efficient pagination with skip/take operations
- Optimized queries with Include() for related data
- CSS and JavaScript minification ready

This application demonstrates enterprise-level practices and can serve as a foundation for larger student management systems or similar educational applications.