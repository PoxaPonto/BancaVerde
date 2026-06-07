using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BancaVerdeAPI.Data;
using Asp.Versioning;
using BancaVerdeAPI.Models;
using BancaVerdeAPI.DTOs;
using BancaVerdeAPI.Responses;

namespace BancaVerdeAPI.Controllers;

[Authorize]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(new ApiResponse<List<CategoryResponseDto>>(
            true,
            "Categorias encontradas com sucesso.",
            categories
        ));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategory(int id)
    {
        var category = await _context.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .FirstOrDefaultAsync();

        if (category == null)
            return NotFound(new ApiResponse<object>(
                false,
                "Categoria não encontrada."
            ));

        return Ok(new ApiResponse<CategoryResponseDto>(
            true,
            "Categoria encontrada com sucesso.",
            category
        ));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory(CreateCategoryDto categoryDto)
    {
        var category = new Category
        {
            Name = categoryDto.Name
        };

        _context.Categories.Add(category);

        await _context.SaveChangesAsync();

        var response = new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name
        };

        return CreatedAtAction(
            nameof(GetCategory),
            new { id = category.Id },
            new ApiResponse<CategoryResponseDto>(
                true,
                "Categoria criada com sucesso.",
                response
            )
        );
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto categoryDto)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
            return NotFound(new ApiResponse<object>(
                false,
                "Categoria não encontrada."
            ));

        category.Name = categoryDto.Name;

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Categoria atualizada com sucesso."
        ));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
            return NotFound(new ApiResponse<object>(
                false,
                "Categoria não encontrada."
            ));

        _context.Categories.Remove(category);

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Categoria removida com sucesso."
        ));
    }
}