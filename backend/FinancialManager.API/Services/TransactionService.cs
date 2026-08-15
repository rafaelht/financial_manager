using FinancialManager.API.Data;
using FinancialManager.API.DTOs;
using FinancialManager.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancialManager.API.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Transaction>> GetAllAsync()
    {
        return await _context.Transactions
            .Include(t => t.Category)
            .OrderByDescending(t => t.CreatedAt)
            .ThenByDescending(t => t.Date)
            .ToListAsync();
    }

    public async Task<Transaction?> GetByIdAsync(int id)
    {
        return await _context.Transactions
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Transaction> CreateAsync(CreateTransactionDto dto)
    {
        var transaction = new Transaction
        {
            Description = dto.Description,
            Amount = dto.Amount,
            Type = dto.Type,
            Date = dto.Date,
            CategoryId = dto.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        await _context.Entry(transaction).Reference(t => t.Category).LoadAsync();

        return transaction;
    }

    public async Task<bool> UpdateAsync(int id, UpdateTransactionDto dto)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
            return false;

        transaction.Description = dto.Description;
        transaction.Amount = dto.Amount;
        transaction.Type = dto.Type;
        transaction.Date = dto.Date;
        transaction.CategoryId = dto.CategoryId;

        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
            return false;

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return true;
    }
}
