using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BancaVerdeAPI.Data;
using BancaVerdeAPI.DTOs;
using Asp.Versioning;
using BancaVerdeAPI.Models;
using BancaVerdeAPI.Responses;

namespace BancaVerdeAPI.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
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

    [HttpPost("sale")]
    public async Task<IActionResult> RegisterSale(SaleRequestDto request)
    {
        var product = await _context.Products.FindAsync(request.ProductId);

        if (product == null)
        {
            return NotFound(new ApiResponse<object>(
                false,
                "Produto não encontrado."
            ));
        }

        if (request.Quantity > product.Stock)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Quantidade maior que o estoque disponível."
            ));
        }

        var oldStock = product.Stock;

        product.Stock -= request.Quantity;

        var userName =
            User.FindFirst(ClaimTypes.Name)?.Value ??
            User.FindFirst("name")?.Value ??
            User.FindFirst(ClaimTypes.Email)?.Value ??
            "Desconhecido";

        _context.StockMovements.Add(new StockMovement
        {
            Action = "SALE",
            UserName = userName,
            ProductName = product.Name,
            OldStock = oldStock,
            NewStock = product.Stock
        });

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Saída de estoque registrada com sucesso."
        ));
    }
}