using FinancialManager.API.DTOs;
using FinancialManager.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinancialManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetDashboard()
    {
        var dashboard = await _service.GetDashboardDataAsync();
        return Ok(dashboard);
    }
}
