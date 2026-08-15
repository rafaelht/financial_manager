using FinancialManager.API.Models;

namespace FinancialManager.API.DTOs;

public class TransactionDto
{
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public DateTime Date { get; set; }

    public int CategoryId { get; set; }

    public string? CategoryName { get; set; }

    public DateTime CreatedAt { get; set; }
}
