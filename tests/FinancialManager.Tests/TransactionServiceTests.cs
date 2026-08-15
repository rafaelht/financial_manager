using FinancialManager.API.Data;
using FinancialManager.API.DTOs;
using FinancialManager.API.Models;
using FinancialManager.API.Services;
using Microsoft.EntityFrameworkCore;

namespace FinancialManager.Tests;

public class TransactionServiceTests
{
    [Fact]
    public async Task CreateAsync_AddsTransactionAndLoadsCategory()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new AppDbContext(options);

        var category = new Category { Id = 1, Name = "Supermercado" };
        context.Categories.Add(category);
        await context.SaveChangesAsync();

        var service = new TransactionService(context);

        var created = await service.CreateAsync(new CreateTransactionDto
        {
            Description = "Compra de víveres",
            Amount = 250.75m,
            Type = TransactionType.Expense,
            Date = new DateTime(2026, 8, 13),
            CategoryId = category.Id
        });

        Assert.Equal("Compra de víveres", created.Description);
        Assert.Equal(250.75m, created.Amount);
        Assert.NotNull(created.Category);
        Assert.Equal("Supermercado", created.Category!.Name);
        Assert.Equal(1, context.Transactions.Count());
    }
}
