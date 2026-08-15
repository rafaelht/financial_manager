using FinancialManager.API.Data;
using FinancialManager.API.DTOs;
using FinancialManager.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancialManager.API.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto> GetDashboardDataAsync()
    {
        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .ToListAsync();

        var totalIncome = transactions
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.Amount);

        var totalExpense = transactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);

        var recentTransactions = transactions
            .OrderByDescending(t => t.CreatedAt)
            .ThenByDescending(t => t.Date)
            .Take(5)
            .Select(t => new TransactionDto
            {
                Id = t.Id,
                Description = t.Description,
                Amount = t.Amount,
                Type = t.Type,
                Date = t.Date,
                CategoryId = t.CategoryId,
                CategoryName = t.Category?.Name,
                CreatedAt = t.CreatedAt
            })
            .ToList();

        var expensesByCategory = transactions
            .Where(t => t.Type == TransactionType.Expense)
            .GroupBy(t => t.Category?.Name ?? "Sin categoría")
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        return new DashboardDto
        {
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            Balance = totalIncome - totalExpense,
            TransactionCount = transactions.Count,
            RecentTransactions = recentTransactions,
            ExpensesByCategory = expensesByCategory
        };
    }
}
