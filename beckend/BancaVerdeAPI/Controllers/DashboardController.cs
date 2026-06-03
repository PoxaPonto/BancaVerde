using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BancaVerdeAPI.Data;

namespace BancaVerdeAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var totalProducts = await _context.Products.CountAsync();
        var totalCategories = await _context.Categories.CountAsync();
        var totalStock = await _context.Products.SumAsync(p => p.Stock);

        var totalInventoryValue = await _context.Products
            .SumAsync(p => p.Price * p.Stock);

        return Ok(new
        {
            TotalProducts = totalProducts,
            TotalCategories = totalCategories,
            TotalStock = totalStock,
            TotalInventoryValue = totalInventoryValue
        });
    }
}