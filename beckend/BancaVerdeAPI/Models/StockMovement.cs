using System.ComponentModel.DataAnnotations;

namespace BancaVerdeAPI.Models;

public class StockMovement
{
    public int Id { get; set; }

    [Required]
    public string Action { get; set; } = string.Empty;

    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string ProductName { get; set; } = string.Empty;

    public int? OldStock { get; set; }

    public int? NewStock { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}