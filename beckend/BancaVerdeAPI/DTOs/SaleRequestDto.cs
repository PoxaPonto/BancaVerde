using System.ComponentModel.DataAnnotations;

namespace BancaVerdeAPI.DTOs;

public class SaleRequestDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}