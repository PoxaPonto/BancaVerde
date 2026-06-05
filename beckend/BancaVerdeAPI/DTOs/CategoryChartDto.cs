namespace BancaVerdeAPI.DTOs;

public class CategoryChartDto
{
    public string CategoryName { get; set; } = string.Empty;

    public int ProductCount { get; set; }

    public int TotalStock { get; set; }
}