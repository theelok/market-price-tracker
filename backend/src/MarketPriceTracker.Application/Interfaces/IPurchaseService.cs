using MarketPriceTracker.Application.DTOs;

namespace MarketPriceTracker.Application.Interfaces;

public interface IPurchaseService
{
    Task<IReadOnlyList<PurchaseDto>> GetAllAsync(int? ingredientId = null, CancellationToken cancellationToken = default);
    Task<PurchaseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<PurchaseDto?> CreateAsync(CreatePurchaseDto dto, CancellationToken cancellationToken = default);
    Task<PurchaseDto?> UpdateAsync(int id, UpdatePurchaseDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
