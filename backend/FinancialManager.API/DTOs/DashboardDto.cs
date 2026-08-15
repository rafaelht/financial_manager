namespace FinancialManager.API.DTOs;

public class DashboardDto
{
    public decimal TotalIncome { get; set; }

    public decimal TotalExpense { get; set; }

    public decimal Balance { get; set; }

    public int TransactionCount { get; set; }

    public List<TransactionDto> RecentTransactions { get; set; } = new();

    public Dictionary<string, decimal> ExpensesByCategory { get; set; } = new();
}
