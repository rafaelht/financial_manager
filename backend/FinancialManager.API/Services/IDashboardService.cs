using FinancialManager.API.DTOs;

namespace FinancialManager.API.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardDataAsync();
}
