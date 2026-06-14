using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BancaVerdeAPI.Data;
using Asp.Versioning;
using BancaVerdeAPI.DTOs;
using BancaVerdeAPI.Models;
using BancaVerdeAPI.Responses;

namespace BancaVerdeAPI.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    private static readonly string[] ProtectedEmails =
    {
        "admin@teste.com",
        "admin@demo.com",
        "user@demo.com"
    };

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    private static bool IsProtectedUser(User user)
    {
        return user.IsProtected ||
               ProtectedEmails.Contains(user.Email.ToLower());
    }

    private string GetCurrentUserName()
    {
        return
            User.FindFirst(ClaimTypes.Name)?.Value ??
            User.FindFirst("name")?.Value ??
            User.FindFirst(ClaimTypes.Email)?.Value ??
            "Desconhecido";
    }

    private void AddUserMovement(
        string action,
        string responsibleUser,
        string affectedUser,
        string details)
    {
        _context.StockMovements.Add(new StockMovement
        {
            Action = action,
            UserName = responsibleUser,
            ProductName = affectedUser,
            OldStock = null,
            NewStock = null,
            CreatedAt = DateTime.UtcNow
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            })
            .ToListAsync();

        return Ok(new ApiResponse<List<UserResponseDto>>(
            true,
            "Usuários encontrados com sucesso.",
            users
        ));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new ApiResponse<object>(
                false,
                "Usuário não encontrado."
            ));
        }

        return Ok(new ApiResponse<UserResponseDto>(
            true,
            "Usuário encontrado com sucesso.",
            user
        ));
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserDto dto)
    {
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == dto.Email);

        if (emailExists)
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Este e-mail já está cadastrado."
            ));
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            IsProtected = false
        };

        _context.Users.Add(user);

        AddUserMovement(
            "CREATE_USER",
            GetCurrentUserName(),
            $"{user.Name} ({user.Email})",
            "Usuário criado"
        );

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Usuário criado com sucesso."
        ));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(
        int id,
        UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound(new ApiResponse<object>(
                false,
                "Usuário não encontrado."
            ));
        }

        if (IsProtectedUser(user))
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Este usuário é protegido e não pode ser editado."
            ));
        }

        var oldUserData = $"{user.Name} ({user.Email}) - {user.Role}";

        user.Name = dto.Name;
        user.Email = dto.Email;
        user.Role = dto.Role;

        AddUserMovement(
            "UPDATE_USER",
            GetCurrentUserName(),
            $"{user.Name} ({user.Email})",
            $"Antes: {oldUserData}"
        );

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Usuário atualizado com sucesso."
        ));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound(new ApiResponse<object>(
                false,
                "Usuário não encontrado."
            ));
        }

        if (IsProtectedUser(user))
        {
            return BadRequest(new ApiResponse<object>(
                false,
                "Este usuário é protegido e não pode ser excluído."
            ));
        }

        var deletedUser = $"{user.Name} ({user.Email})";

        AddUserMovement(
            "DELETE_USER",
            GetCurrentUserName(),
            deletedUser,
            "Usuário excluído"
        );

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Usuário removido com sucesso."
        ));
    }
}