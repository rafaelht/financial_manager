using FinancialManager.API.DTOs;
using FinancialManager.API.Models;

namespace FinancialManager.API.Services;

public interface ITransactionService
{
    Task<IEnumerable<Transaction>> GetAllAsync();

    Task<Transaction?> GetByIdAsync(int id);

    Task<Transaction> CreateAsync(CreateTransactionDto dto);

    Task<bool> UpdateAsync(int id, UpdateTransactionDto dto);

    Task<bool> DeleteAsync(int id);
}