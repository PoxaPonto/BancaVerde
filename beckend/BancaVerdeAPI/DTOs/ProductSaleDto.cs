using System.ComponentModel.DataAnnotations;

namespace BancaVerdeAPI.DTOs;

public class ProductSaleDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
    public int Quantity { get; set; }
}