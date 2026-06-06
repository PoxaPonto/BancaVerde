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
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        AppDbContext context,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == request.Email);

        if (emailExists)
        {
            _logger.LogWarning(
                "Tentativa de cadastro com e-mail já existente: {Email}",
                request.Email
            );

            return BadRequest(new ApiResponse<object>(
                false,
                "Este e-mail já está cadastrado."
            ));
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User"
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Novo usuário cadastrado. Id: {UserId}, Nome: {Name}, Email: {Email}",
            user.Id,
            user.Name,
            user.Email
        );

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
        {
            _logger.LogWarning(
                "Tentativa de login com e-mail inexistente: {Email}",
                loginData.Email
            );

            return Unauthorized(new ApiResponse<object>(
                false,
                "E-mail ou senha inválidos."
            ));
        }

        bool passwordValid = BCrypt.Net.BCrypt.Verify(
            loginData.Password,
            user.Password
        );

        if (!passwordValid)
        {
            _logger.LogWarning(
                "Tentativa de login com senha inválida. Usuário: {UserId}, Email: {Email}",
                user.Id,
                user.Email
            );

            return Unauthorized(new ApiResponse<object>(
                false,
                "E-mail ou senha inválidos."
            ));
        }

        var userRole = string.IsNullOrWhiteSpace(user.Role)
            ? "User"
            : user.Role;

        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"]!
        );

        var expiresAt = DateTime.UtcNow.AddHours(
            _configuration.GetValue<int>("Jwt:ExpirationHours")
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

            Expires = expiresAt,

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
            Role = userRole,
            ExpiresAt = expiresAt
        };

        _logger.LogInformation(
            "Login realizado com sucesso. Usuário: {UserId}, Nome: {Name}, Email: {Email}, Role: {Role}",
            user.Id,
            user.Name,
            user.Email,
            userRole
        );

        return Ok(new ApiResponse<object>(
            true,
            "Login realizado com sucesso.",
            loginResponse
        ));
    }
}