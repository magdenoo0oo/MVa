using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace StudentManagement.Models
{
    public class Department
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Department name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Department name must be between 2 and 100 characters")]
        [Remote("IsNameAvailable", "Departments", AdditionalFields = "Id", ErrorMessage = "Department name already exists")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Budget is required")]
        [Range(0, 10000000, ErrorMessage = "Budget must be between 0 and 10,000,000")]
        [Display(Name = "Budget ($)")]
        public decimal Budget { get; set; }

        [Display(Name = "Established Date")]
        [DataType(DataType.Date)]
        public DateTime? EstablishedDate { get; set; }

        // Navigation property
        public virtual ICollection<Student> Students { get; set; } = new List<Student>();
    }
}