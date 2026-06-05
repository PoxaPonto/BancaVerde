using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BancaVerdeAPI.Data;
using BancaVerdeAPI.DTOs;
using BancaVerdeAPI.Models;
using BancaVerdeAPI.Responses;

namespace BancaVerdeAPI.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
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
            Role = dto.Role
        };

        _context.Users.Add(user);

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

        user.Name = dto.Name;
        user.Email = dto.Email;
        user.Role = dto.Role;

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

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Usuário removido com sucesso."
        ));
    }
}