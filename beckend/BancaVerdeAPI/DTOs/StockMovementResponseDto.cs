namespace BancaVerdeAPI.DTOs;

public class StockMovementResponseDto
{
    public int Id { get; set; }

    public string Action { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    public int? OldStock { get; set; }

    public int? NewStock { get; set; }

    public DateTime CreatedAt { get; set; }
}