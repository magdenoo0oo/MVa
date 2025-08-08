using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Data;
using StudentManagement.Models;

namespace StudentManagement.Controllers
{
    public class DepartmentsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DepartmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Departments
        public async Task<IActionResult> Index(string search, string sortOrder, int? page)
        {
            ViewData["CurrentSort"] = sortOrder;
            ViewData["NameSortParm"] = String.IsNullOrEmpty(sortOrder) ? "name_desc" : "";
            ViewData["IdSortParm"] = sortOrder == "Id" ? "id_desc" : "Id";
            ViewData["CurrentFilter"] = search;

            var departments = from d in _context.Departments select d;

            if (!String.IsNullOrEmpty(search))
            {
                departments = departments.Where(d => d.Name.Contains(search) || 
                                               d.Description!.Contains(search));
            }

            switch (sortOrder)
            {
                case "name_desc":
                    departments = departments.OrderByDescending(d => d.Name);
                    break;
                case "Id":
                    departments = departments.OrderBy(d => d.Id);
                    break;
                case "id_desc":
                    departments = departments.OrderByDescending(d => d.Id);
                    break;
                default:
                    departments = departments.OrderBy(d => d.Name);
                    break;
            }

            int pageSize = 5;
            return View(await PaginatedList<Department>.CreateAsync(departments.AsNoTracking(), page ?? 1, pageSize));
        }

        [HttpPost]
        public async Task<IActionResult> Search(string searchString)
        {
            var departments = from d in _context.Departments select d;

            if (!String.IsNullOrEmpty(searchString))
            {
                departments = departments.Where(d => d.Name.Contains(searchString) || 
                                               d.Description!.Contains(searchString));
            }

            return PartialView("_DepartmentsList", await departments.ToListAsync());
        }

        // GET: Departments/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var department = await _context.Departments
                .Include(d => d.Students)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (department == null)
            {
                return NotFound();
            }

            return View(department);
        }

        // GET: Departments/Create
        [Authorize(Roles = "Admin")]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Departments/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([Bind("Name,Description,Budget,EstablishedDate")] Department department)
        {
            if (ModelState.IsValid)
            {
                _context.Add(department);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(department);
        }

        // GET: Departments/Edit/5
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var department = await _context.Departments.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }
            return View(department);
        }

        // POST: Departments/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description,Budget,EstablishedDate")] Department department)
        {
            if (id != department.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(department);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DepartmentExists(department.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(department);
        }

        // GET: Departments/Delete/5
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var department = await _context.Departments
                .Include(d => d.Students)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (department == null)
            {
                return NotFound();
            }

            return View(department);
        }

        // POST: Departments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var department = await _context.Departments
                .Include(d => d.Students)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (department != null)
            {
                if (department.Students.Any())
                {
                    TempData["Error"] = "Cannot delete department with students. Please reassign students first.";
                    return RedirectToAction(nameof(Delete), new { id = id });
                }

                _context.Departments.Remove(department);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index));
        }

        // Remote validation
        public async Task<IActionResult> IsNameAvailable(string name, int? id)
        {
            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Name == name && d.Id != id);

            return Json(department == null);
        }

        private bool DepartmentExists(int id)
        {
            return _context.Departments.Any(e => e.Id == id);
        }
    }
}