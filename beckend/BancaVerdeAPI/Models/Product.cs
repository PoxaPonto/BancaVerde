using System.ComponentModel.DataAnnotations;

namespace BancaVerdeAPI.Models;

public class Product
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome do produto é obrigatório.")]
    [StringLength(100, ErrorMessage = "O nome pode ter no máximo 100 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, 999999.99, ErrorMessage = "O preço deve ser maior que zero.")]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "O estoque não pode ser negativo.")]
    public int Stock { get; set; }

    [Required]
    public int CategoryId { get; set; }

    public Category? Category { get; set; }
}