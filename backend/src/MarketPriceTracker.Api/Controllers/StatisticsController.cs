using MarketPriceTracker.Application.DTOs;
using MarketPriceTracker.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MarketPriceTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController(IStatisticsService statisticsService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(StatisticsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<StatisticsDto>> Get(CancellationToken cancellationToken)
    {
        var stats = await statisticsService.GetStatisticsAsync(cancellationToken);
        return Ok(stats);
    }

    [HttpGet("ingredients")]
    [ProducesResponseType(typeof(IReadOnlyList<IngredientStatisticsDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<IngredientStatisticsDto>>> GetIngredientStatistics(
        CancellationToken cancellationToken)
    {
        var stats = await statisticsService.GetIngredientStatisticsAsync(cancellationToken);
        return Ok(stats);
    }
}
