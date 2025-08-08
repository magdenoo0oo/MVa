using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Models;

namespace StudentManagement.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Seed roles
            string[] roleNames = { "Admin", "Student" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Seed admin user
            var adminEmail = "admin@studentmanagement.com";
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "System",
                    LastName = "Administrator",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Seed student user
            var studentEmail = "student@studentmanagement.com";
            if (await userManager.FindByEmailAsync(studentEmail) == null)
            {
                var studentUser = new ApplicationUser
                {
                    UserName = studentEmail,
                    Email = studentEmail,
                    FirstName = "John",
                    LastName = "Doe",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(studentUser, "Student123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(studentUser, "Student");
                }
            }

            // Seed departments
            if (!context.Departments.Any())
            {
                var departments = new[]
                {
                    new Department { Name = "Computer Science", Description = "Study of computers and computational systems", Budget = 500000, EstablishedDate = new DateTime(1995, 1, 1) },
                    new Department { Name = "Mathematics", Description = "Study of numbers, quantity, and space", Budget = 300000, EstablishedDate = new DateTime(1990, 1, 1) },
                    new Department { Name = "Physics", Description = "Study of matter, energy, and their interactions", Budget = 450000, EstablishedDate = new DateTime(1992, 1, 1) },
                    new Department { Name = "Chemistry", Description = "Study of substances and their properties", Budget = 400000, EstablishedDate = new DateTime(1993, 1, 1) }
                };

                context.Departments.AddRange(departments);
                await context.SaveChangesAsync();
            }

            // Seed students
            if (!context.Students.Any())
            {
                var students = new[]
                {
                    new Student
                    {
                        FirstName = "Alice",
                        LastName = "Johnson",
                        Email = "alice.johnson@example.com",
                        PhoneNumber = "555-0101",
                        DateOfBirth = new DateTime(2000, 5, 15),
                        DepartmentId = 1,
                        GPA = 3.8,
                        EnrollmentDate = new DateTime(2022, 9, 1)
                    },
                    new Student
                    {
                        FirstName = "Bob",
                        LastName = "Smith",
                        Email = "bob.smith@example.com",
                        PhoneNumber = "555-0102",
                        DateOfBirth = new DateTime(1999, 8, 22),
                        DepartmentId = 2,
                        GPA = 3.5,
                        EnrollmentDate = new DateTime(2021, 9, 1)
                    },
                    new Student
                    {
                        FirstName = "Carol",
                        LastName = "Davis",
                        Email = "carol.davis@example.com",
                        PhoneNumber = "555-0103",
                        DateOfBirth = new DateTime(2001, 2, 10),
                        DepartmentId = 3,
                        GPA = 3.9,
                        EnrollmentDate = new DateTime(2023, 1, 15)
                    }
                };

                context.Students.AddRange(students);
                await context.SaveChangesAsync();
            }
        }
    }
}