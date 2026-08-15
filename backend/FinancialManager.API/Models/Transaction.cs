using System.Text.Json.Serialization;

namespace FinancialManager.API.Models;

public class Transaction
{
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public DateTime Date { get; set; }

    public int CategoryId { get; set; }

    [JsonIgnore]
    public Category? Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}