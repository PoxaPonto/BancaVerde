using System.ComponentModel.DataAnnotations;

namespace BancaVerdeAPI.DTOs;

public class CreateCategoryDto
{
    [Required(ErrorMessage = "O nome da categoria é obrigatório.")]
    [StringLength(100, ErrorMessage = "O nome pode ter no máximo 100 caracteres.")]
    public string Name { get; set; } = string.Empty;
}