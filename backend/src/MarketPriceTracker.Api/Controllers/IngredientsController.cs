using MarketPriceTracker.Application.DTOs;
using MarketPriceTracker.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MarketPriceTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IngredientsController(IIngredientService ingredientService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<IngredientDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<IngredientDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await ingredientService.GetAllAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(IngredientDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IngredientDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await ingredientService.GetByIdAsync(id, cancellationToken);
        return item is null ? NotFound(new { message = "Ingredient not found." }) : Ok(item);
    }

    [HttpPost]
    [ProducesResponseType(typeof(IngredientDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<IngredientDto>> Create(
        [FromBody] CreateIngredientDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var item = await ingredientService.CreateAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(IngredientDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<IngredientDto>> Update(
        int id,
        [FromBody] UpdateIngredientDto dto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var item = await ingredientService.UpdateAsync(id, dto, cancellationToken);
            return item is null ? NotFound(new { message = "Ingredient not found." }) : Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await ingredientService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound(new { message = "Ingredient not found." });
    }
}


