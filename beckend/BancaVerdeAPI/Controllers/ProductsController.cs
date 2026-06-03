using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BancaVerdeAPI.Data;
using BancaVerdeAPI.Models;

namespace BancaVerdeAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Products
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/Products/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return NotFound("Produto não encontrado.");

        return Ok(product);
    }

    // GET: api/Products/search/banana
    [HttpGet("search/{name}")]
    public async Task<IActionResult> SearchProducts(string name)
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Name.Contains(name))
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/Products/category/1
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetProductsByCategory(int categoryId)
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();

        return Ok(products);
    }

    // POST: api/Products
    [HttpPost]
    public async Task<IActionResult> CreateProduct(Product product)
    {
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == product.CategoryId);

        if (!categoryExists)
            return BadRequest("Categoria não encontrada.");

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetProduct),
            new { id = product.Id },
            product
        );
    }

    // PUT: api/Products/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product updatedProduct)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound("Produto não encontrado.");

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == updatedProduct.CategoryId);

        if (!categoryExists)
            return BadRequest("Categoria não encontrada.");

        product.Name = updatedProduct.Name;
        product.Price = updatedProduct.Price;
        product.Stock = updatedProduct.Stock;
        product.CategoryId = updatedProduct.CategoryId;

        await _context.SaveChangesAsync();

        return Ok(product);
    }

    // DELETE: api/Products/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound("Produto não encontrado.");

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}