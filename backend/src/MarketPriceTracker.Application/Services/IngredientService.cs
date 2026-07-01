using MarketPriceTracker.Application.DTOs;
using MarketPriceTracker.Application.Interfaces;
using MarketPriceTracker.Domain.Models;

namespace MarketPriceTracker.Application.Services;

public class IngredientService(IIngredientRepository repository) : IIngredientService
{
    public async Task<IReadOnlyList<IngredientDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await repository.GetAllAsync(cancellationToken);
        return items.Select(MapToDto).ToList();
    }

    public async Task<IngredientDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetByIdAsync(id, cancellationToken);
        return item is null ? null : MapToDto(item);
    }

    public async Task<IngredientDto> CreateAsync(CreateIngredientDto dto, CancellationToken cancellationToken = default)
    {
        var name = dto.Name.Trim();
        var existing = await repository.GetByNameAsync(name, cancellationToken);
        if (existing is not null)
        {
            throw new InvalidOperationException($"An ingredient named '{name}' already exists.");
        }

        var ingredient = new Ingredient
        {
            Name = name,
            Category = dto.Category.Trim()
        };

        await repository.AddAsync(ingredient, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);
        return MapToDto(ingredient);
    }

    public async Task<IngredientDto?> UpdateAsync(int id, UpdateIngredientDto dto, CancellationToken cancellationToken = default)
    {
        var ingredient = await repository.GetByIdAsync(id, cancellationToken);
        if (ingredient is null) return null;

        var name = dto.Name.Trim();
        var duplicate = await repository.GetByNameAsync(name, cancellationToken);
        if (duplicate is not null && duplicate.Id != id)
        {
            throw new InvalidOperationException($"An ingredient named '{name}' already exists.");
        }

        ingredient.Name = name;
        ingredient.Category = dto.Category.Trim();
        repository.Update(ingredient);
        await repository.SaveChangesAsync(cancellationToken);
        return MapToDto(ingredient);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var ingredient = await repository.GetByIdAsync(id, cancellationToken);
        if (ingredient is null) return false;

        repository.Remove(ingredient);
        await repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static IngredientDto MapToDto(Ingredient ingredient)
    {
        var latest = ingredient.Purchases.OrderByDescending(p => p.PurchaseDate).FirstOrDefault();
        return new IngredientDto
        {
            Id = ingredient.Id,
            Name = ingredient.Name,
            Category = ingredient.Category,
            CreatedAt = ingredient.CreatedAt,
            PurchaseCount = ingredient.Purchases.Count,
            LatestPrice = latest?.Price,
            LatestPurchaseDate = latest?.PurchaseDate
        };
    }
}
