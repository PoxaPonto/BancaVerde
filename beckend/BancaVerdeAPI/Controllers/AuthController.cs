using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BancaVerdeAPI.Data;
using BancaVerdeAPI.Models;
using BancaVerdeAPI.DTOs;
using BancaVerdeAPI.Responses;

namespace BancaVerdeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == request.Email);

        if (emailExists)
            return BadRequest(new ApiResponse<object>(
                false,
                "Este e-mail já está cadastrado."
            ));

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User"
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object>(
            true,
            "Usuário cadastrado com sucesso."
        ));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest loginData)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginData.Email);

        if (user == null)
            return Unauthorized(new ApiResponse<object>(
                false,
                "E-mail ou senha inválidos."
            ));

        bool passwordValid = BCrypt.Net.BCrypt.Verify(
            loginData.Password,
            user.Password
        );

        if (!passwordValid)
            return Unauthorized(new ApiResponse<object>(
                false,
                "E-mail ou senha inválidos."
            ));

        var userRole = string.IsNullOrWhiteSpace(user.Role)
            ? "User"
            : user.Role;

        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"]!
        );

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, userRole)
            }),

            Expires = DateTime.UtcNow.AddHours(2),

            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        var loginResponse = new
        {
            Token = tokenHandler.WriteToken(token),
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = userRole
        };

        return Ok(new ApiResponse<object>(
            true,
            "Login realizado com sucesso.",
            loginResponse
        ));
    }
}