using System.ComponentModel.DataAnnotations;

namespace BancaVerdeAPI.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "User";

    public bool IsProtected { get; set; } = false;
}