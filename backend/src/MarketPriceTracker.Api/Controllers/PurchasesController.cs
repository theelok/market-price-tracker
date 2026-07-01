using MarketPriceTracker.Application.DTOs;
using MarketPriceTracker.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MarketPriceTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchasesController(IPurchaseService purchaseService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PurchaseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PurchaseDto>>> GetAll(
        [FromQuery] int? ingredientId,
        CancellationToken cancellationToken)
    {
        var purchases = await purchaseService.GetAllAsync(ingredientId, cancellationToken);
        return Ok(purchases);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PurchaseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PurchaseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var purchase = await purchaseService.GetByIdAsync(id, cancellationToken);
        return purchase is null ? NotFound(new { message = "Purchase not found." }) : Ok(purchase);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PurchaseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PurchaseDto>> Create(
        [FromBody] CreatePurchaseDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var purchase = await purchaseService.CreateAsync(dto, cancellationToken);
        return purchase is null
            ? NotFound(new { message = "Ingredient not found." })
            : CreatedAtAction(nameof(GetById), new { id = purchase.Id }, purchase);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PurchaseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PurchaseDto>> Update(
        int id,
        [FromBody] UpdatePurchaseDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var purchase = await purchaseService.UpdateAsync(id, dto, cancellationToken);
        return purchase is null ? NotFound(new { message = "Purchase not found." }) : Ok(purchase);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await purchaseService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound(new { message = "Purchase not found." });
    }
}


