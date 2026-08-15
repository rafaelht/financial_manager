using FinancialManager.API.Data;
using FinancialManager.API.DTOs;
using FinancialManager.API.Models;
using FinancialManager.API.Services;
using Microsoft.EntityFrameworkCore;

namespace FinancialManager.Tests;

public class DashboardServiceTests
{
    [Fact]
    public async Task GetDashboardDataAsync_ReturnsTotalsAndRecentTransactions()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new AppDbContext(options);

        var category = new Category { Id = 1, Name = "Salario" };
        context.Categories.Add(category);

        context.Transactions.AddRange(
            new Transaction
            {
                Id = 1,
                Description = "Salario mensual",
                Amount = 4500m,
                Type = TransactionType.Income,
                Date = new DateTime(2026, 8, 10),
                CategoryId = category.Id,
                Category = category,
                CreatedAt = new DateTime(2026, 8, 9)
            },
            new Transaction
            {
                Id = 2,
                Description = "Renta",
                Amount = 1800m,
                Type = TransactionType.Expense,
                Date = new DateTime(2026, 8, 11),
                CategoryId = category.Id,
                Category = category,
                CreatedAt = new DateTime(2026, 8, 12)
            }
        );

        await context.SaveChangesAsync();

        var service = new DashboardService(context);

        var result = await service.GetDashboardDataAsync();

        Assert.Equal(4500m, result.TotalIncome);
        Assert.Equal(1800m, result.TotalExpense);
        Assert.Equal(2700m, result.Balance);
        Assert.Equal(2, result.TransactionCount);
        Assert.Equal(2, result.RecentTransactions.Count);
        Assert.True(result.ExpensesByCategory.ContainsKey("Salario"));
    }
}
