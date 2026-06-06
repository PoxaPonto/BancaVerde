namespace BancaVerdeAPI.DTOs;

public class DashboardResponseDto
{
    public int TotalProducts { get; set; }
    public int TotalCategories { get; set; }
    public int TotalUsers { get; set; }
    public int TotalStock { get; set; }
    public int LowStockProducts { get; set; }
    public decimal TotalInventoryValue { get; set; }

    public object? MostExpensiveProduct { get; set; }
    public object? CheapestProduct { get; set; }
    public object? CategoryWithMostProducts { get; set; }

    public List<object> LowStockItems { get; set; } = new();

    public List<CategoryChartDto> ProductsByCategory { get; set; } = new();
}