using MarketPriceTracker.Application.Interfaces;
using MarketPriceTracker.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketPriceTracker.Infrastructure.Data.Repositories;

public class IngredientRepository(ApplicationDbContext context) : IIngredientRepository
{
    public async Task<IReadOnlyList<Ingredient>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await context.Ingredients
            .Include(i => i.Purchases)
            .OrderBy(i => i.Name)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<Ingredient?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.Ingredients
            .Include(i => i.Purchases)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

    public async Task<Ingredient?> GetByNameAsync(string name, CancellationToken cancellationToken = default) =>
        await context.Ingredients
            .FirstOrDefaultAsync(i => EF.Functions.ILike(i.Name, name), cancellationToken);

    public async Task AddAsync(Ingredient ingredient, CancellationToken cancellationToken = default)
    {
        await context.Ingredients.AddAsync(ingredient, cancellationToken);
    }

    public void Update(Ingredient ingredient) => context.Ingredients.Update(ingredient);

    public void Remove(Ingredient ingredient) => context.Ingredients.Remove(ingredient);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        context.SaveChangesAsync(cancellationToken);
}
