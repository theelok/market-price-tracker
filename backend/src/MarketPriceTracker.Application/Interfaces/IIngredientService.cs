using MarketPriceTracker.Application.DTOs;

namespace MarketPriceTracker.Application.Interfaces;

public interface IIngredientService
{
    Task<IReadOnlyList<IngredientDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IngredientDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IngredientDto> CreateAsync(CreateIngredientDto dto, CancellationToken cancellationToken = default);
    Task<IngredientDto?> UpdateAsync(int id, UpdateIngredientDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
