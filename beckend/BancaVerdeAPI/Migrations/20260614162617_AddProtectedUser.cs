using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BancaVerdeAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProtectedUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsProtected",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsProtected",
                table: "Users");
        }
    }
}
