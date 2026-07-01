using MarketPriceTracker.Domain.Models;

namespace MarketPriceTracker.Application.Interfaces;

public interface IPurchaseRepository
{
    Task<IReadOnlyList<Purchase>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Purchase>> GetByIngredientIdAsync(int ingredientId, CancellationToken cancellationToken = default);
    Task<Purchase?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Purchase purchase, CancellationToken cancellationToken = default);
    void Update(Purchase purchase);
    void Remove(Purchase purchase);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
