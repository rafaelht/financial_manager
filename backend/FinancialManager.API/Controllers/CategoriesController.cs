using FinancialManager.API.Data;
using FinancialManager.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinancialManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Id)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetById(int id)
    {
        var category = await _context.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .FirstOrDefaultAsync();

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(CreateCategoryDto createDto)
    {
        var category = new Category { Name = createDto.Name };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCategoryDto updateDto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound();

        category.Name = updateDto.Name;
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound();

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class CategoryDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateCategoryDto
{
    public string Name { get; set; } = string.Empty;
}
