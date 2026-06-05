using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BancaVerdeAPI.Data;
using BancaVerdeAPI.DTOs;
using BancaVerdeAPI.Responses;

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
        var totalUsers = await _context.Users.CountAsync();

        var totalStock = await _context.Products.SumAsync(p => p.Stock);

        var lowStockProducts = await _context.Products
            .CountAsync(p => p.Stock <= 10);

        var totalInventoryValue = await _context.Products
            .SumAsync(p => p.Price * p.Stock);

        var mostExpensiveProduct = await _context.Products
            .OrderByDescending(p => p.Price)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price
            })
            .FirstOrDefaultAsync();

        var cheapestProduct = await _context.Products
            .OrderBy(p => p.Price)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price
            })
            .FirstOrDefaultAsync();

        var categoryWithMostProducts = await _context.Categories
            .Select(c => new
            {
                c.Id,
                c.Name,
                ProductCount = c.Products.Count
            })
            .OrderByDescending(c => c.ProductCount)
            .FirstOrDefaultAsync();

        var productsByCategory = await _context.Categories
            .Select(c => new CategoryChartDto
            {
                CategoryName = c.Name,
                ProductCount = c.Products.Count,
                TotalStock = c.Products.Sum(p => p.Stock)
            })
            .ToListAsync();

        var dashboard = new DashboardResponseDto
        {
            TotalProducts = totalProducts,
            TotalCategories = totalCategories,
            TotalUsers = totalUsers,
            TotalStock = totalStock,
            LowStockProducts = lowStockProducts,
            TotalInventoryValue = totalInventoryValue,
            MostExpensiveProduct = mostExpensiveProduct,
            CheapestProduct = cheapestProduct,
            CategoryWithMostProducts = categoryWithMostProducts,
            ProductsByCategory = productsByCategory
        };

        return Ok(new ApiResponse<DashboardResponseDto>(
            true,
            "Dashboard carregado com sucesso.",
            dashboard
        ));
    }
}