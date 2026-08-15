using FinancialManager.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancialManager.API.Data;

public static class SeedData
{
    public static void Initialize(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        context.Database.Migrate();

        if (context.Categories.Any())
        {
            return;
        }

        var categories = new[]
        {
            new Category { Name = "Salario" },
            new Category { Name = "Freelance" },
            new Category { Name = "Alquiler" },
            new Category { Name = "Supermercado" },
            new Category { Name = "Transporte" },
            new Category { Name = "Entretenimiento" },
            new Category { Name = "Servicios" }
        };

        context.Categories.AddRange(categories);
        context.SaveChanges();

        var salario = context.Categories.Single(c => c.Name == "Salario");
        var freelance = context.Categories.Single(c => c.Name == "Freelance");
        var alquiler = context.Categories.Single(c => c.Name == "Alquiler");
        var supermercado = context.Categories.Single(c => c.Name == "Supermercado");
        var transporte = context.Categories.Single(c => c.Name == "Transporte");
        var entretenimiento = context.Categories.Single(c => c.Name == "Entretenimiento");
        var servicios = context.Categories.Single(c => c.Name == "Servicios");

        var today = DateTime.UtcNow;

        var transactions = new[]
        {
            new Transaction
            {
                Description = "Nómina mensual",
                Amount = 4200m,
                Type = TransactionType.Income,
                Date = today.AddDays(-1),
                CategoryId = salario.Id,
                CreatedAt = today.AddDays(-1)
            },
            new Transaction
            {
                Description = "Proyecto freelance",
                Amount = 1200m,
                Type = TransactionType.Income,
                Date = today.AddDays(-5),
                CategoryId = freelance.Id,
                CreatedAt = today.AddDays(-5)
            },
            new Transaction
            {
                Description = "Renta del apartamento",
                Amount = 1800m,
                Type = TransactionType.Expense,
                Date = today.AddDays(-2),
                CategoryId = alquiler.Id,
                CreatedAt = today.AddDays(-2)
            },
            new Transaction
            {
                Description = "Compra del supermercado",
                Amount = 620m,
                Type = TransactionType.Expense,
                Date = today.AddDays(-3),
                CategoryId = supermercado.Id,
                CreatedAt = today.AddDays(-3)
            },
            new Transaction
            {
                Description = "Gasolina y transporte",
                Amount = 260m,
                Type = TransactionType.Expense,
                Date = today.AddDays(-6),
                CategoryId = transporte.Id,
                CreatedAt = today.AddDays(-6)
            },
            new Transaction
            {
                Description = "Streaming y cine",
                Amount = 180m,
                Type = TransactionType.Expense,
                Date = today.AddDays(-7),
                CategoryId = entretenimiento.Id,
                CreatedAt = today.AddDays(-7)
            },
            new Transaction
            {
                Description = "Internet y luz",
                Amount = 240m,
                Type = TransactionType.Expense,
                Date = today.AddDays(-8),
                CategoryId = servicios.Id,
                CreatedAt = today.AddDays(-8)
            },
            new Transaction
            {
                Description = "Recarga de celular",
                Amount = 95m,
                Type = TransactionType.Expense,
                Date = today.AddDays(-9),
                CategoryId = servicios.Id,
                CreatedAt = today.AddDays(-9)
            }
        };

        context.Transactions.AddRange(transactions);
        context.SaveChanges();
    }
}
