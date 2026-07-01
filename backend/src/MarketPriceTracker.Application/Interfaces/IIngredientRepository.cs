using MarketPriceTracker.Domain.Models;

namespace MarketPriceTracker.Application.Interfaces;

public interface IIngredientRepository
{
    Task<IReadOnlyList<Ingredient>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Ingredient?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Ingredient?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task AddAsync(Ingredient ingredient, CancellationToken cancellationToken = default);
    void Update(Ingredient ingredient);
    void Remove(Ingredient ingredient);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
