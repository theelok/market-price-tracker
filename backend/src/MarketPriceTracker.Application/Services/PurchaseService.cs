using MarketPriceTracker.Application.DTOs;
using MarketPriceTracker.Application.Interfaces;
using MarketPriceTracker.Domain.Models;

namespace MarketPriceTracker.Application.Services;

public class PurchaseService(
    IPurchaseRepository purchaseRepository,
    IIngredientRepository ingredientRepository) : IPurchaseService
{
    public async Task<IReadOnlyList<PurchaseDto>> GetAllAsync(
        int? ingredientId = null,
        CancellationToken cancellationToken = default)
    {
        var purchases = ingredientId.HasValue
            ? await purchaseRepository.GetByIngredientIdAsync(ingredientId.Value, cancellationToken)
            : await purchaseRepository.GetAllAsync(cancellationToken);

        return purchases.Select(MapToDto).ToList();
    }

    public async Task<PurchaseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var purchase = await purchaseRepository.GetByIdAsync(id, cancellationToken);
        return purchase is null ? null : MapToDto(purchase);
    }

    public async Task<PurchaseDto?> CreateAsync(CreatePurchaseDto dto, CancellationToken cancellationToken = default)
    {
        var ingredient = await ingredientRepository.GetByIdAsync(dto.IngredientId, cancellationToken);
        if (ingredient is null) return null;

        var purchase = new Purchase
        {
            IngredientId = dto.IngredientId,
            ShopName = dto.ShopName.Trim(),
            Quantity = dto.Quantity,
            Unit = dto.Unit.Trim(),
            Price = dto.Price,
            PurchaseDate = dto.PurchaseDate.ToUniversalTime(),
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim()
        };

        await purchaseRepository.AddAsync(purchase, cancellationToken);
        await purchaseRepository.SaveChangesAsync(cancellationToken);
        purchase.Ingredient = ingredient;
        return MapToDto(purchase);
    }

    public async Task<PurchaseDto?> UpdateAsync(int id, UpdatePurchaseDto dto, CancellationToken cancellationToken = default)
    {
        var purchase = await purchaseRepository.GetByIdAsync(id, cancellationToken);
        if (purchase is null) return null;

        purchase.ShopName = dto.ShopName.Trim();
        purchase.Quantity = dto.Quantity;
        purchase.Unit = dto.Unit.Trim();
        purchase.Price = dto.Price;
        purchase.PurchaseDate = dto.PurchaseDate.ToUniversalTime();
        purchase.Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim();

        purchaseRepository.Update(purchase);
        await purchaseRepository.SaveChangesAsync(cancellationToken);
        return MapToDto(purchase);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var purchase = await purchaseRepository.GetByIdAsync(id, cancellationToken);
        if (purchase is null) return false;

        purchaseRepository.Remove(purchase);
        await purchaseRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static PurchaseDto MapToDto(Purchase purchase) => new()
    {
        Id = purchase.Id,
        IngredientId = purchase.IngredientId,
        IngredientName = purchase.Ingredient?.Name ?? string.Empty,
        ShopName = purchase.ShopName,
        Quantity = purchase.Quantity,
        Unit = purchase.Unit,
        Price = purchase.Price,
        PurchaseDate = purchase.PurchaseDate,
        Notes = purchase.Notes,
        CreatedAt = purchase.CreatedAt
    };
}

