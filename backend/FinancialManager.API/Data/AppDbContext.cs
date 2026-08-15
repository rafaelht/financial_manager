using FinancialManager.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancialManager.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Transaction> Transactions => Set<Transaction>();

    public DbSet<Category> Categories => Set<Category>();
}