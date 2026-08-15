using System.Text.Json.Serialization;

namespace FinancialManager.API.Models;

public class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<Transaction> Transactions { get; set; }
        = new List<Transaction>();
}