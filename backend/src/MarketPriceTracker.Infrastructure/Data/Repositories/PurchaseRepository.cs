using MarketPriceTracker.Application.Interfaces;
using MarketPriceTracker.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketPriceTracker.Infrastructure.Data.Repositories;

public class PurchaseRepository(ApplicationDbContext context) : IPurchaseRepository
{
    public async Task<IReadOnlyList<Purchase>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await context.Purchases
            .Include(p => p.Ingredient)
            .OrderByDescending(p => p.PurchaseDate)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Purchase>> GetByIngredientIdAsync(
        int ingredientId,
        CancellationToken cancellationToken = default) =>
        await context.Purchases
            .Include(p => p.Ingredient)
            .Where(p => p.IngredientId == ingredientId)
            .OrderByDescending(p => p.PurchaseDate)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<Purchase?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.Purchases
            .Include(p => p.Ingredient)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task AddAsync(Purchase purchase, CancellationToken cancellationToken = default)
    {
        await context.Purchases.AddAsync(purchase, cancellationToken);
    }

    public void Update(Purchase purchase) => context.Purchases.Update(purchase);

    public void Remove(Purchase purchase) => context.Purchases.Remove(purchase);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        context.SaveChangesAsync(cancellationToken);
}
