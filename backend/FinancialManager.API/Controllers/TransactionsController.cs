using FinancialManager.API.DTOs;
using FinancialManager.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinancialManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _service;

    public TransactionsController(ITransactionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetAll()
    {
        var transactions = await _service.GetAllAsync();
        var dtos = transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Description = t.Description,
            Amount = t.Amount,
            Type = t.Type,
            Date = t.Date,
            CategoryId = t.CategoryId,
            CategoryName = t.Category?.Name,
            CreatedAt = t.CreatedAt
        }).ToList();

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TransactionDto>> GetById(int id)
    {
        var transaction = await _service.GetByIdAsync(id);
        if (transaction == null)
            return NotFound();

        var dto = new TransactionDto
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Amount = transaction.Amount,
            Type = transaction.Type,
            Date = transaction.Date,
            CategoryId = transaction.CategoryId,
            CategoryName = transaction.Category?.Name,
            CreatedAt = transaction.CreatedAt
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> Create([FromBody] CreateTransactionDto createDto)
    {
        var transaction = await _service.CreateAsync(createDto);
        var dto = new TransactionDto
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Amount = transaction.Amount,
            Type = transaction.Type,
            Date = transaction.Date,
            CategoryId = transaction.CategoryId,
            CategoryName = transaction.Category?.Name,
            CreatedAt = transaction.CreatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTransactionDto updateDto)
    {
        var success = await _service.UpdateAsync(id, updateDto);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
