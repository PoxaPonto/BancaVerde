using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    private string GetUserName()
    {
        return User.FindFirst(ClaimTypes.Name)?.Value ??
               User.FindFirst("name")?.Value ??
               User.FindFirst(ClaimTypes.Email)?.Value ??
               "Desconhecido";
    }

[HttpGet]
public async Task<IActionResult> GetProducts(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? search = null,
    [FromQuery] string? category = null,
    [FromQuery] string? sort = "name-asc")
{
    if (page <= 0)
        page = 1;

    if (pageSize <= 0)
        pageSize = 10;

    var query = _context.Products
        .Include(p => p.Category)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(search))
    {
        query = query.Where(p =>
            p.Name.Contains(search)
        );
    }

    if (!string.IsNullOrWhiteSpace(category) && category != "all")
    {
        query = query.Where(p =>
            p.Category != null &&
            p.Category.Name == category
        );
    }

    query = sort switch
    {
        "name-desc" => query.OrderByDescending(p => p.Name),
        "price-high" => query.OrderByDescending(p => p.Price),
        "price-low" => query.OrderBy(p => p.Price),
        "stock-high" => query.OrderByDescending(p => p.Stock),
        "stock-low" => query.OrderBy(p => p.Stock),
        _ => query.OrderBy(p => p.Name)
    };

    var totalRecords = await query.CountAsync();

    var products = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(p => new ProductResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            Stock = p.Stock,
            CategoryName = p.Category != null
                ? p.Category.Name
                : ""
        })
        .ToListAsync();

    var totalPages = (int)Math.Ceiling(
        totalRecords / (double)pageSize
    );

    var response = new PagedResponseDto<ProductResponseDto>
    {
        Page = page,
        PageSize = pageSize,
        TotalRecords = totalRecords,
        TotalPages = totalPages,
        Data = products
    };

    return Ok(
        new ApiResponse<PagedResponseDto<ProductResponseDto>>(
            true,
            "Produtos encontrados com sucesso.",
            response
        )
    );
}

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Id == id)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Stock = p.Stock,
                CategoryName = p.Category != null ? p.Category.Name : ""
            })
            .FirstOrDefaultAsync();

        if (product == null)
            return NotFound(new ApiResponse<object>(
                false,
                "Produto não encontrado."
            ));

        return Ok(new ApiResponse<ProductResponseDto>(
            true,
            "Produto encontrado com sucesso.",
            product
        ));
    }

    [HttpGet("search/{name}")]
    public async Task<IActionResult> SearchProducts(string name)
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Name.Contains(name))
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Stock = p.Stock,
                CategoryName = p.Category != null ? p.Category.Name : ""
            })
            .ToListAsync();

        return Ok(new ApiResponse<List<ProductResponseDto>>(
            true,
            "Busca realizada com sucesso.",
            products
        ));
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetProductsByCategory(int categoryId)
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Stock = p.Stock,
                CategoryName = p.Category != null ? p.Category.Name : ""
            })
            .ToListAsync();

        return Ok(new ApiResponse<List<ProductResponseDto>>(
            true,
            "Produtos da categoria encontrados com sucesso.",
            products
        ));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct(CreateProductDto productDto)
    {
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == productDto.CategoryId);

        if (!categoryExists)
            return BadRequest(new ApiResponse<object>(
                false,
                "Categoria não encontrada."
            ));

        var product = new Product
        {
            Name = productDto.Name,
            Price = productDto.Price,
            Stock = productDto.Stock,
            CategoryId = productDto.CategoryId
        };

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        _context.StockMovements.Add(new StockMovement
        {
            Action = "CREATE",
            UserName = GetUserName(),
            ProductName = product.Name,
            NewStock = product.Stock
        });

        await _context.SaveChangesAsync();

        var response = new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            Stock = product.Stock,
            CategoryName = ""
        };

        return CreatedAtAction(
            nameof(GetProduct),
            new { version = "1.0", id = product.Id },
            new ApiResponse<ProductResponseDto>(
                true,
                "Produto criado com sucesso.",
                response
            )
        );
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(
        int id,
        UpdateProductDto updatedProduct)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound(new ApiResponse<object>(
                false,
                "Produto não encontrado."
            ));

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == updatedProduct.CategoryId);

        if (!categoryExists)
            return BadRequest(new ApiResponse<object>(
                false,
                "Categoria não encontrada."
            ));

        var oldStock = product.Stock;

        product.Name = updatedProduct.Name;
        product.Price = updatedProduct.Price;
        product.Stock = updatedProduct.Stock;
        product.CategoryId = updatedProduct.CategoryId;

        await _context.SaveChangesAsync();

        _context.StockMovements.Add(new StockMovement
        {
            Action = "UPDATE",
            UserName = GetUserName(),
            ProductName = product.Name,
            OldStock = oldStock,
            NewStock = product.Stock
        });

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Produto atualizado com sucesso."
        ));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/sale")]
    public async Task<IActionResult> RegisterSale(
        int id,
        ProductSaleDto saleDto)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound(new ApiResponse<object>(
                false,
                "Produto não encontrado."
            ));

        if (saleDto.Quantity > product.Stock)
            return BadRequest(new ApiResponse<object>(
                false,
                "Quantidade vendida maior que o estoque disponível."
            ));

        var oldStock = product.Stock;

        product.Stock -= saleDto.Quantity;

        await _context.SaveChangesAsync();

        _context.StockMovements.Add(new StockMovement
        {
            Action = "SALE",
            UserName = GetUserName(),
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

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound(new ApiResponse<object>(
                false,
                "Produto não encontrado."
            ));

        _context.StockMovements.Add(new StockMovement
        {
            Action = "DELETE",
            UserName = GetUserName(),
            ProductName = product.Name,
            OldStock = product.Stock
        });

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Produto removido com sucesso."
        ));
    }
}