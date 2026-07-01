using MarketPriceTracker.Application.DTOs;

namespace MarketPriceTracker.Application.Interfaces;

public interface IStatisticsService
{
    Task<StatisticsDto> GetStatisticsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<IngredientStatisticsDto>> GetIngredientStatisticsAsync(CancellationToken cancellationToken = default);
}
