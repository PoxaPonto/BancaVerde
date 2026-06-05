using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BancaVerdeAPI.Data;
using BancaVerdeAPI.DTOs;
using BancaVerdeAPI.Responses;

namespace BancaVerdeAPI.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class StockMovementsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StockMovementsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMovements()
    {
        var movements = await _context.StockMovements
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new StockMovementResponseDto
            {
                Id = m.Id,
                Action = m.Action,
                UserName = m.UserName,
                ProductName = m.ProductName,
                OldStock = m.OldStock,
                NewStock = m.NewStock,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return Ok(new ApiResponse<List<StockMovementResponseDto>>(
            true,
            "Movimentações encontradas com sucesso.",
            movements
        ));
    }
}